import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/styles.css';
import Login from './pages/Login';
import Trainers from "../src/pages/TrainersPage";
import Groups  from "./pages/GroupsPage";
import Members from "./pages/MembersPage";
import Register from './pages/Register';
import Appointments from './pages/AppointmentsPage';
import PresenceView from './pages/PresenceView';
import PresenceAdd from './pages/PresenceAdd';
import AddTrainer from"./components/trainer/AddTrainer";
import AddMember from './components/member/AddMember';
import AddGroup from './components/group/AddGroup';
import AddApp from './components/appointments/AddApp';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
    <IonRouterOutlet id="main">
                    <Route exact path="/">
                        <Redirect to="/login"/>
                    </Route>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/trainers" component={Trainers}/>
                    <Route exact path="/trainers/add" component={AddTrainer}/>
                    <Route exact path="/groups" component={Groups}/>
                    <Route exact path="/groups/add" component={AddGroup}/>
                    <Route exact path="/members" component={Members}/>
                    <Route exact path="/members/add" component={AddMember}/>
                    <Route exact path="/appointments" component={Appointments}/>
                    <Route exact path="/appointments/add" component={AddApp}/>
                    <Route exact path="/presences/:id" component={PresenceView}/>
                    <Route exact path="/presences/add/:id" component={PresenceAdd}/>
                </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
