import { createPortal } from "react-dom"
import Content from "./Content"

export default function Section({activate, setActivate}){
    return (
        <>
            {
                activate && createPortal(
                    <Content onClose={setActivate}/>,
                    document.getElementById("portal"),
              )}
        </>
    )

}