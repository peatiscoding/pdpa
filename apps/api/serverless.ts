import type { AWS } from '@serverless/typescript'
import { hello } from '@lambdas/index'

const serverlessConfiguration: AWS = {
  service: 'pdpa-maketh-api',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'ap-southeast-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: false,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {
      role: {
        statements: [
        ],
      },
    },
  },
  package: {
    individually: true,
  },
  custom: {
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