export default async function TaskIdPage({ params, }:{
    params: Promise<{ taskid: string }>
}) {
    const taskid = (await params).taskid;
    return <h1>Editing Task {taskid}</h1>;

}