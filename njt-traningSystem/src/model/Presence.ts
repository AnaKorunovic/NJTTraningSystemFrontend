import Member from "./Member";
import Appointment from "./Appointment";

interface Presence {
    member:Member;
    appointment:Appointment;
    message: string;
    presence: boolean;
    user: number
}
export default Presence;