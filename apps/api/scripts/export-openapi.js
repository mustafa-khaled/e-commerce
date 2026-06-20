"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const path_1 = require("path");
const app_module_1 = require("../src/app.module");
async function exportOpenApi() {
    const moduleRef = await testing_1.Test.createTestingModule({ imports: [app_module_1.AppModule] }).compile();
    const app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('EE Commerce API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    const outPath = (0, path_1.resolve)(__dirname, '../../../packages/api-contract/openapi.json');
    (0, fs_1.writeFileSync)(outPath, JSON.stringify(document, null, 2));
    console.log(`OpenAPI spec written to ${outPath}`);
    await app.close();
}
exportOpenApi().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=export-openapi.js.map