/***/
import { levelBuildHelper } from "../helpers/levelBuilderFunctionHelper"
import { useSubscribeState } from "../subscribe_state/index"
import { Level, levelState } from "../models/Level"
import "../styles/screens/levels.css"

export default function Levers() {
    const [{ level, levels }, dispatch] = useSubscribeState(["level", "levels"])

    function handleSeletLevel(_level: number) {
        dispatch({ type: "InitializeGame", level: _level, ...levelBuildHelper(_level) })
    }

    function getClassName(obj: Level) {
        return `${obj.state === levelState.desactivated ? "close-box" : obj.state === levelState.activated ? "open-box" : "complete-box"} ${obj.level === level ? "select-box" : ""}`
    }

    return (
        <section className="level" >
            <div className="level-header">
                <h2>Levers</h2>
                <button tabindex={0} className="btn" onClick={() => dispatch({ type: "GoToHome" })} >
                    <img src="images/back.png" atl="image of back arrow" />
                </button>
            </div>
            <div className="level-content">
                <div className="level-container">
                    {
                        levels.map((e: Level) =>
                            <article key={e.level} className={getClassName(e)}
                                onClick={() => {
                                    if (e.state !== levelState.desactivated) { handleSeletLevel(e.level + 1) }
                                }}
                                role="button" tabindex={e.level}>
                                <span>{e.level + 1}</span>
                            </article>)
                    }
                </div>
            </div>
        </section>)
}