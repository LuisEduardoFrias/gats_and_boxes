//
import { InterfaceGlobalState } from "./models/InterfaceGlobalState"
import { DomainGlobalState } from "./models/DomainGlobalState"
import useInitialize from "./subscribe_state/index"
import levels from "./assets/jsons/levels.json"
import intefaceReducer from "./reducers/interfaceReducer"
import domainReducer from "./reducers/domainReducer"
import { levelState } from "./models/Level"
import { selectAll } from "./models/SelectAll"
import Game from "./screens/Game"
import './App.css'

const domInitialState: DomainGlobalState = {
    virtualGrid: [],
    level: null,
    movements: 0,
    catsInBoxes: [],
    tiles_position: undefined,
}

const intInitialState: InterfaceGlobalState = {
    tile_seleted: undefined,
    levels: levels.map((_, i) => ({ level: i, state: i <= 1 ? levelState.activated : levelState.desactivated })),
    shadow_in_grid: [],
    boxChangeImg: [],
    confetti: false,
    release: true,
    sound: { volume: 40, muted: false },
    music: { volume: 40, muted: false },
    menuGame: false,
    levelsView: false,
    playView: false,
    settingView: false,
    tutorialView: false,
    selectAll: selectAll.none,
}

const initialState: DomainGlobalState & InterfaceGlobalState = {
    ...intInitialState,
    ...domInitialState,
}

function reducer(state: DomainGlobalState & InterfaceGlobalState, actions: any) {

    let result = domainReducer(state, actions)

    if (!result)
        result = intefaceReducer(state, actions)

    if (!result)
        alert(`the action ${actions.type} isn't valid.`)
    else
        return result;
}
//
export default function App() {
    useInitialize(reducer, initialState);
    return (<Game />)
}
