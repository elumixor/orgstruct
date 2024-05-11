import { boards, database, descriptors, tags, tasks, values } from "./db";

const { db, connection } = database();

function cleanStuff() {
    // Remove all tasks, values, and descriptors
    return db.transaction(async (tx) => {
        await tx.delete(values);
        await tx.delete(tags);
        await tx.delete(tasks);
        await tx.delete(boards);
        await tx.delete(descriptors);
    });
}
function insertStuff() {
    return db.transaction(async (tx) => {
        // Create a descriptor
        const [
            { descriptorId: nameId },
            { descriptorId: childrenId },
            { descriptorId: parentsId },
            { descriptorId: tagId },
        ] = await tx
            .insert(descriptors)
            .values([
                {
                    type: "text",
                    name: "Name",
                },
                {
                    type: "relation",
                    name: "Children",
                    multiple: true,
                },
                {
                    type: "relation",
                    name: "Parents",
                    multiple: true,
                },
                {
                    type: "tag",
                    name: "Priority",
                    multiple: false,
                },
            ])
            .returning({ descriptorId: descriptors.id });

        console.log(`Created a descriptors with ids [${nameId}, ${childrenId}, ${parentsId}]`);

        // Now, also create a board data table
        const [{ boardId }] = await tx
            .insert(boards)
            .values({
                nameDescriptorId: nameId,
                childrenDescriptorId: childrenId,
                parentsDescriptorId: parentsId,
            })
            .returning({ boardId: boards.id });

        console.log(`Created a board with id ${boardId}`);

        // For priorities, we need to create a list of available values
        const [{ descriptorId: highId }, { descriptorId: mediumId }, { descriptorId: lowId }] = await tx
            .insert(tags)
            .values([
                {
                    descriptorId: tagId,
                    label: "High",
                    color: "#FF0000",
                },
                {
                    descriptorId: tagId,
                    label: "Medium",
                    color: "#00FF00",
                },
                {
                    descriptorId: tagId,
                    label: "Low",
                    color: "#0000FF",
                },
            ])
            .returning({ descriptorId: tags.id });

        // Create two tasks
        const [{ taskId: firstId }, { taskId: secondId }] = await tx
            .insert(tasks)
            .values([{}, {}])
            .returning({ taskId: tasks.id });

        console.log(`Created tasks with ids [${firstId}, ${secondId}]`);

        await tx.insert(values).values([
            // Add name to both tasks
            {
                descriptorId: nameId,
                taskId: firstId,
                text: "First task",
            },
            {
                descriptorId: nameId,
                taskId: secondId,
                text: "Second task",
            },
            // Make second task a child of the first
            {
                descriptorId: childrenId,
                taskId: firstId,
                relation: secondId,
            },
            {
                descriptorId: parentsId,
                taskId: secondId,
                relation: firstId,
            },
            // Add priorities
            {
                descriptorId: tagId,
                taskId: firstId,
                tag: highId,
            },
            {
                descriptorId: tagId,
                taskId: secondId,
                tag: lowId,
            },
        ]);

        console.log(`Values inserted`);
    });
}

void (async () => {
    // const tasksS = schema.tasks;
    // const propertiesS = schema.properties;

    // type Task = typeof schema.tasks.$inferInsert;

    // Clean some data
    await cleanStuff();

    // Insert some data
    await insertStuff();

    // Now let's query the data
    // We want to get all the tasks, their properties and values

    // .leftJoin(tags, eq(descriptors.id, tags.descriptorId));

    // console.log(groupBy(v, "id"));
    //     properties: {
    //         descriptor: true,
    //         values: true,
    //     },
    // });

    // await db.insert(schema.properties).values({});

    // const props = await db.query.properties.findMany();
    // const tasks = await db.query.tasks.findMany();

    // console.log(props, tasks);
    console.log("Done");
    await connection.end();
})();
