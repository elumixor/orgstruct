import { boolean, integer, pgEnum, pgTable, serial, varchar } from "drizzle-orm/pg-core";

// First, we support several property types
export const typeEnum = pgEnum("type", ["text", "relation", "tag"]);

// Each property has a descriptor containing its type, name, and some optional properties
export const descriptors = pgTable("descriptors", {
    id: serial("id").primaryKey(),
    type: typeEnum("type").default("text").notNull(),
    name: varchar("name").notNull(),
    multiple: boolean("multiple"),
});

// We have a list of tasks. Each task is a container for property "instances"
export const tasks = pgTable("tasks", {
    id: serial("id").primaryKey(),
});

// Allowed values for tags
export const tags = pgTable("tags", {
    id: serial("id").primaryKey(),
    descriptorId: integer("descriptorId")
        .notNull()
        .references(() => descriptors.id),
    label: varchar("name").notNull(),
    color: varchar("color", { length: 7 }).default("#333333").notNull(), // hex
});

// Property values - sparse table
export const values = pgTable("values", {
    id: serial("id").primaryKey(), // because we can have multiple values for the same property
    taskId: integer("taskId")
        .notNull()
        .references(() => tasks.id),
    descriptorId: integer("descriptorId")
        .notNull()
        .references(() => descriptors.id),
    text: varchar("text"), // text
    relation: integer("relation").references(() => tasks.id), // reference
    tag: integer("tag").references(() => tags.id), // tag
});

// Board data - we need to know which property to use for name, children, and parents
export const boards = pgTable("boards", {
    id: serial("id").primaryKey(),
    nameDescriptorId: integer("nameDescriptorId")
        .notNull()
        .references(() => descriptors.id),
    childrenDescriptorId: integer("childrenDescriptorId")
        .notNull()
        .references(() => descriptors.id),
    parentsDescriptorId: integer("parentsDescriptorId")
        .notNull()
        .references(() => descriptors.id),
});
