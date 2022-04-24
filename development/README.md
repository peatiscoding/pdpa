# Service Design Document

The document aims to provide the broad understanding of the System's philosophy and its usecases. The Document will be divided into multiple sections.

Before proceed any further. Please visit our [Design Spirit](./design-spirit.md) section to understand what are the reasons behind these project decision. And what's the core value we aims to provide from this project.

## Usecases

In Thailand our IT industry is ever growing business and it is growing fast. Now within 2021, Thailand government had issued a **Personal Data Protection Act** (PDPA) - visit this [link](https://t-reg.co/blog/t-reg-knowledge/%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B9%83%E0%B8%88-pdpa-%E0%B9%83%E0%B8%99-5-%E0%B8%99%E0%B8%B2%E0%B8%97%E0%B8%B5-%E0%B8%AA%E0%B8%A3%E0%B8%B8%E0%B8%9B%E0%B8%97%E0%B8%B8%E0%B8%81%E0%B8%AD/) for a short description of what it is. The Act's enforcement was postponed from year 2021 to June 2022. In very short time these rules will be enforced.

1. Provide an API for Backend service to invoke:
    1. Manage a Consent Action.
    1. Consent Action has its own version control.
    1. Consent Action cannot be altered after being published.
    1. Query Consent Actions.
    1. Customer may query their own consent Actions.
    1. Customer may update their descisiotn on the consent Actions.
    1. All consent actions will be marked with the decision date.
    1. Customer are saved against the Consentual Actions based on Hashing policy which is differ for each tenant.
    1. Each tenant will have their own salt. Changing such salt invalidate all consents created.

## Technical Design

### Principal Data Objects
1. **Tenant** -- The client application that consume our service.
    * Tenant object itself has list of **ApiKey**s to manage. For granting API usages to consumer.
    * Also tenant object defines how the **Customer** can be derived as a primary key so that it can be used to associated with the **Consent Action** object.
        * This logic is defined as a definition object that has its own versioning -- The reason is; The hashing algorithm cannot be changed once it enters the database; unless we implement a migration script that can run through the whole database by running older version hashing against the new ones.
        * In addition to hashing policy and its management, We will also need a flexible identification. For example. One Tenant required `firstName`, `thaiId` and `mobileNumber` to identify the uniqness of the customer. Another Tenant required `firstName` and `thaiId` only. Or even more edge case One tenant would like `firstName` or `lastName` and `thaiId`, this requirement will be impossible to do with the rigid hashing function. Hence we design this part to be its customizable algorithm.
    * Following are consider _extra module_
        * Searching through **Identity Keys**
            * With all these customisation inputs are all **PII** data hence we can never save these directly. Rather we will need to hash each of them to a separate fields with separate salts for each tenant and use it as a Searchable Fields. We only offer 3 searchable terms.
            * With all these limitations and customisation in mind. We can offer a searchable function as a separate system (ElasticSearch that sit outside the core module.) Basically our elastic search can save Table that has association of Identity Hash result against Hashed PII data. (A Rainbow table). Then we can use this ElasticSearch to serve Tenant that need this functionality.
1. **Consent Action** -- The consent action can be created, each consent has its own version which once published, it cannot be changed.
    * Following are the fields we are to provided as an Action that can offer:
        * `_tenant_id` the owner of this object.
        * `uuid` a unique id of consent; we can use this for reference.
        * `consent` a HTML text describe the check mark user checked. We can offer a multiple langauge in future release.
        * `version` a version for Consumer
        * `optional` boolean - the consent is totally optional, And user may opt out from answering it (Hence `ignored` value can be saved to the `Consent`)
        * `_published_at` the date that the aplication has been published. Once published it will stays forever. Unless tenant has been deleted.
        * `_updated_by` Author of changes of the content.
        * `_label` a adminsitration label of the consent; this label is aim for ease of use in administration purpose only.
        * `_next_version` a string to next version, if set to null. Means it is the latest version.
        * `_v` the version of the schema, for further upgrade, migrate we can use this to facilitate how our data can be updated properly. Currently: `_V=0.1`
    * Primary Key: `[_tenant_id, uuid, version]`
    * DynamoDB
        * Primary HashKey: `t<_tenant_id>@c<customer_hash>`
        * Primary SortKey: `csnt/act:<is_active>/<_consent_uuid>+<_consent_version>/`
1. **Customer** -- The identity that would like to give, update, and store our consent against. Customer definition and requirement are defined based on **Tenant**. These are logical object that doesn't really exist in our system. (We may say that the only identity exists in our system is the Identity's HashKey in the **Consent** object).
1. **Consent** -- The core object of consensus that **Customer** had authorized against **Consent Action**.
    * The Consent object is the data that can only be created/updated. (No delete, as long as Tenant is exists).
    * Fields to be saved
        * `resource_id` the consent `t<_tenant_id>@c<customer_hash>/csnt/<_consent_uuid>+<_consent_version>/`
        * `_tenant_id` the owner of this object.
        * `customer_hash` the customer hash
        * `consent_uuid` the UUID of the consent action.
        * `consent_version` the version of the consent it associated with.
        * `decision` the descision customer has made: `A`, `D`, `I`, (Accepted, Decliend, Ignored)
        * `_is_active` boolean field that denote that the object is active. (By migrate to next consent version. This field will be set to false once user accept newer version.).
        * `_is_outdated` boolean field that denote that the object is no longer up-to-date. (Change this to `true` whenever new consent action has been published)
        * `created_by` the apiKey or userId who's responsible for such changes.
    * Primary Key: `[resource_id]`
    * DynamoDB
        * Primary HashKey: `t<_tenant_id>@c<customer_hash>`
        * Primary SortKey: `csnt/act:<is_active>/<_consent_uuid>+<_consent_version>/`
1. **Consent History** -- The history changes of the **Consent** whenever it was created/updated/deleted (soft).
    * This object may only be created and may never been altered.
    * Fields to be saved
        * `resource_id` the consent `t<_tenant_id>/consent/<_consent_uuid>+<_consent_version>/<date>`
        * `_tenant_id` the owner of this object.
        * `customer_hash` the customer hash
        * `consent_uuid` the UUID of the consent action.
        * `consent_version` the version of the consent it associated with.
        * `created_at` the change date
        * `created_by` the apiKey or userId who's responsible for such changes.
        * `changes_json` changes: `keys: [_is_active, _is_outdated, decision]`
        * `summary`
    * PrimaryKey: `[resource_id]`
    * DynamoDB
        * Primary HashKey: `t<_tenant_id>@c<customer_hash>`
        * Primary SortKey: `<created_at>`
        * Secondary HashKey: `t<_tenant_id>@c<customer_hash>::/csnt/<_consent_uuid>+<_consent_version>`
        * Secondary SortKey: `<created_at>`

### The APIs offered

Module|Action|by Admin|by APIKey
--|--|--|--
**Tenant**|Create|Yes|-
**Tenant**|Update|Yes|-
**Tenant**|Delete|Yes|-
**Tenant**|Get List|Yes|-
**Tenant**|Get One|Yes|Yes|Yes
**Consent Action**|Create|Yes|Yes
**Consent Action**|Update|Yes|Yes
**Consent Action**|Publish|Yes|Yes
**Consent Action**|Delete (Soft)|Yes|Yes
**Consent Action**|Get List|Yes|Yes
**Consent**|Create One|-|Yes
**Consent**|Update One|-|Yes
**Consent**|List pending Consents by customer|-|Yes
**Consent**|List all Consents by customer|-|Yes
**Consent**|Get one by consent Id + Customer|-|Yes
**Consent**|Get list by Consent Id + Customers|-|Yes
**Consent History**|List by Customer|-|Yes

`Customers` in the list refers to Complete list of Customer Identification confirmed with Tenant's configuration.


### Authentication

TBD
