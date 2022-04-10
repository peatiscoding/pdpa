import type { AWS } from '@serverless/typescript'
import { hello } from '@lambdas/index'

const serverlessConfiguration: AWS = {
  service: 'pdpa-maketh-api',
  frameworkVersion: '3',
  package: {
    individually: true,
  },
  plugins: [
    'serverless-esbuild',
    'serverless-dynamodb-local',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'ap-southeast-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: false,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      TABLE_NAME_CAT: '${self:custom.tableNames.cat}',
      STAGE: '${self:custom.stage}',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:DescribeTable',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
        Resource: [
          {
            'Fn::GetAtt': [
              'CatDynamoTable',
              'Arn',
            ]
          }
        ]
      },
    ],
  },
  resources: {
    Resources: {
      'CatDynamoTable': {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:custom.tableNames.cat}',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'N',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          }
        }
      }
    }
  },
  custom: {
    stage: '${opt:stage, self:provider.stage}',
    tableNames: {
      cat: '${self:custom.stage}-cats',
    },
    dynamodb: {
      stages: [
        'dev',
      ],
      start: {
        migrate: true,
        port: 8002,
        inMemory: true,
        heapInitial: '200m',
        healMax: '1g',
        seed: false,
        convertEmptyValues: true,
      }
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: {
        'require.resolve': undefined,
      },
      watch: {
        pattern: ['src/**/*.ts'],
        ignore: ['temp/**/*'],
      },
      platform: 'node',
      concurrency: 10,
    },
  },
  functions: {
    hello,
  }
}

module.exports = serverlessConfiguration