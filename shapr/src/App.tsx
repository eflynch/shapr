import React, { useEffect, useState } from 'react';

function Circle(props:{position:{x:number, y:number}}) {
  return <div style={{position:"absolute", top:`${100*props.position.y}vh`, left:`${100*props.position.x}vw`, width:20, height:20, borderRadius:9999, backgroundColor:"black"}} />
}

function SphereOutOfBounds(position:{x:number,y:number}):{x:number,y:number}{
  const {x,y} = position;
  if (x < 0) {
    return {x:y, y:-x}
  }
  if (y < 0) {
    return {x:-y, y:x}
  }
  if (x >= 1) {
    return {x:y, y:1-(x-1)}
  }
  if (y >=1) {
    return {x:1-(y-1), y:x}
  }
  return position
}

function TorusOutOfBounds(position:{x:number,y:number}):{x:number,y:number}{
  return {x:(position.x % 1 + 1) % 1, y:(position.y % 1 + 1) % 1}
}

function Shape(props:{
  position:{x:number,y:number},
  setPosition:(position:{x:number,y:number})=>void,
  outOfBounds:(position:{x:number,y:number})=>{x:number,y:number}
  }){
  useEffect(()=>{
    if (props.position.x < 0 || props.position.y < 0 || props.position.x >= 1 || props.position.y >= 1) {
      props.setPosition(props.outOfBounds(props.position))
    }
  }, [props.position, props.outOfBounds, props.setPosition])
  return (
    <div style={{overflow:"hidden", position:"relative", width:"100vw", height:"100vh", backgroundColor:"gray"}}>
      <Circle position={props.position}/>
    </div>
  )
}

type Shape = "sphere" | "torus"
const Shapes:Shape[] = ["sphere", "torus"]
function App() {
  const [shape, setShape] = useState<Shape>("sphere")
  const [position, setPosition] = useState<{x:number, y:number}>({x:0.5,y:0.5})

  useEffect(()=>{
    const keyHandler = (e:KeyboardEvent)=>{
      const delta = 0.01
      setPosition((()=>{
        switch(shape){
          case "sphere":
            switch(e.key){
              case "ArrowLeft":
                return {x:position.x - delta, y:position.y + delta}
              case "ArrowRight":
                return {x:position.x + delta, y:position.y - delta}
              case "ArrowUp":
                return {x:position.x - delta, y:position.y - delta}
              case "ArrowDown":
                return {x:position.x + delta, y:position.y + delta}
              default:
                return {x:position.x, y:position.y}
            }
            case "torus":
              switch(e.key){
                case "ArrowLeft":
                  return {x:position.x - delta, y:position.y}
                case "ArrowRight":
                  return {x:position.x + delta, y:position.y}
                case "ArrowUp":
                  return {x:position.x, y:position.y - delta}
                case "ArrowDown":
                  return {x:position.x, y:position.y + delta}
                default:
                  return {x:position.x, y:position.y} 
              }
        }
      })())
    }

    document.addEventListener("keydown",keyHandler)
    return () =>{
      document.removeEventListener("keydown", keyHandler)
    }
  }, [shape, position, setPosition])
  return (<>
    <Shape outOfBounds={(()=>{
      switch(shape) {
        case "sphere":
          return SphereOutOfBounds
        case "torus":
          return TorusOutOfBounds
      }
    })()} position={position} setPosition={setPosition} />
    <div style={{position:"absolute", top:0}}>
      {Shapes.map((s)=>{
        return <button disabled={s === shape} key={s} onClick={()=>setShape(s)}>{s}</button>
      })}
    </div>
  </>)
}

export default App;
