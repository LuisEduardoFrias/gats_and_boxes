import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities';
import { useSubscribeState, dispatch } from "../subscribe_state/index"
import Point from "../models/point"
import { Piece } from "../models/piece"
import "../styles/tiles.css"

export default function Tiles() {
    const [{ pieces, tile_seleted, tiles_position }, _] = useSubscribeState(["pieces", "tile_seleted", "tiles_position"])

    return (
        <>
            {pieces.map((piece: Piece, index: number) => <DrawTile
                index={index}
                piece={piece}
                tile_seleted={tile_seleted}
                tiles_position={tiles_position}
            />)}
        </>
    )
}

type TDrawTileProps = {
    piece: Piece,
    index: number,
    tile_seleted: string,
    tiles_position: any
}

function DrawTile({ piece, index, tile_seleted, tiles_position }: TDrawTileProps) {

    const isSelected = piece.name === tile_seleted;
    const rotation = tiles_position[piece.name].rotation;
    const position = tiles_position[piece.name].point;

    piece.rotation = rotation;
    const width = rotation === 0 || rotation === 180 ? piece.size.horizontal.width : piece.size.vertical.width;
    const height = rotation === 0 || rotation === 180 ? piece.size.horizontal.height : piece.size.vertical.height;
    const _left = ((position?.x) * 64);
    const _bottom = ((position?.y) * 64);

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: piece.name,
        data: {
            pieces: piece.tiles.filter(e => e.rotation === rotation)[0],
            width,
            height
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const tileStyle = {
        ...style,
        position: "absolute",
        width: "0px",//`${width}px`,
        height: "0px",//`${height}px`,
        bottom: `${_bottom}px`,
        left: `${_left}px`,
        border: "0px solid yellow"
    }

    return (
        <div key={index} tabindex={index} className={`tile-container ${piece.name} ${isSelected ? "tile-select" : ""}`} style={tileStyle}  >
            {isSelected && <Control tile_name={piece.name} rotation={rotation} orientation={height} />}

            {piece.tiles.map((e, i) => {
                if (piece.rotation === e.rotation)
                    return (
                        <>
                            {
                                e.tiles.map((o, ind) => <Pieces
                                    piece={o}
                                    refr={setNodeRef}
                                    pieceName={piece.name}
                                    rotation={piece.rotation}
                                    isSelected={isSelected}
                                    onclick={() => dispatch({ type: "SeletTile", tile: piece.name })}
                                    index={ind}
                                    listeners={listeners}
                                    attributes={attributes} />)
                            }
                        </>
                    )
            })}
        </div>
    )
}

type TPieces = {
    piece: any,
    refr: any
    isSelected: boolean,
    rotation: number,
    pieceName: string,
    onclick: any,
    index: number,
    listeners: any
    attributes: any
}

function Pieces({ piece, refr, isSelected, rotation, pieceName, onclick, index, listeners, attributes }: TPieces) {

    const color = pieceName === "t" ? "#ffff02" :
        (pieceName === "l" ? "#04fff5" :
            (pieceName === "li" ? "#1c63ff" : "#43ff0a"));

    const stylePiece = {
        position: "absolute",
        border: `4px solid ${"#43ff0a"}`,
        left: `${(piece.x) * 64}px`,
        bottom: `${(piece.y) * 64}px`,
        borderColor: piece.img.includes("box") ? (piece.has_gat ? "red" : color) : color,
    }

    return (
        <div style={stylePiece} ref={refr} className={`tile-piece ${piece.img.includes("box") ? "tile-box" : "tile-tile"}`} onClick={onclick} {...(isSelected ? listeners : null)} {...(isSelected ? attributes : null)} >
            <img key={index} src={`/images/${piece.img}.png`} />
        </div>
    )
}

function Control({ tile_name, rotation, orientation }: { tile_name: string, rotation: 0 | 90 | 180 | 270, orientation: number }) {

    const controlStyle = {
        top: `${-orientation - 50}px`
    }

    return (
        <div className="tile-control-container" style={controlStyle} >
            <button className="tile-control-btn tile-control-rotate" onClick={() => dispatch({ type: "ChangeRotation", rotation: (rotation + 90 > 270 ? 0 : rotation + 90), tile_name })} >
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" /></svg>
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
                </div>
            </button>
            <button className="tile-control-btn tile-control-insert" onClick={() => dispatch({ type: "SeletTile", tile: undefined })}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" /></svg>
            </button>
        </div >
    )
}