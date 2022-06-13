import Group from "./Group";

interface Member {
    id:number;
    name: string;
    lastname: string;
    jmbg: string;
    number: string;
    groupId:Group;
    user: number
}
export default Member;