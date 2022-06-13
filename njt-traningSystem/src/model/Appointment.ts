import Group from "./Group";
import Presence from "./Presence";

interface Appointment {
    id:number;
    date: Date;
    time: string;
    groupId:Group;
    user: number;
    //presence: Array<Presence>;
}
export default Appointment;