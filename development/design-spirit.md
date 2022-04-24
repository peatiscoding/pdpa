# Design Spirit

Regardless of the project functionality. This project aims to provide a testbed for Technical Stack that author would like to utilise and gain a deeper understanding of:

1. Service that use Monorepo pattern 
    * Using **Turbo Repo** which provides
        * Application Service
        * Application Control Panel (Dashboard)
        * Application Documentation (Docs)
1. The project will be using
    * TypeScript
    * DynamoDB + Single Table Design
    * Serverless (AWS as provider)
1. Service that can potentially become a SaaS
    * The functionality offered are being used with the multiple tenant concept.
    * Customisation between each tenant is possible.
    * Tenant should be using same paradigm to configure.
1. Bonus stuff
    * OpenAPI document

## Out of Scope

1. The service will not provide a Customer's authentication. The service is designed to be server-to-server communication. Meaning the "end customer" will be authorized by Service's consumer. The APIs author provide are provided as a Trusted Request. (You can simply call us as a managed Repository with specifci logic.)
1. The service does not aim to explore hiearchical level of admin user management. Hence allowing tenants to login into backend to manage their own stuff is not included in the application (at least in this version). All management will be done by single Admin user. Even in our SaaS context.