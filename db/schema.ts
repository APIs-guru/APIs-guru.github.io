import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const apis = sqliteTable("Apis", {
  name: text("name").notNull().primaryKey(),
  description: text("description"),
  title: text("title").notNull(),
  categories: text("categories"),
  tags: text("tags"),
  contact: text("contact"),
  license: text("license"),
  logoUrl: text("logoUrl"),
  swaggerUrl: text("swaggerUrl"),
  swaggerYamlUrl: text("swaggerYamlUrl"),
  externalUrl: text("externalUrl"),
  version: text("version"),
  added: text("added").notNull(),
  updated: text("updated").notNull(),
});

export const apiVisits = sqliteTable("ApiVisits", {
  api_name: text("api_name").notNull().primaryKey(),
  visits: integer("visits").notNull().default(0),
});
