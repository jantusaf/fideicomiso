import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Featured.scss";

const Featured = (props) => {
  return (
    <div className="featured">
        <div className="top">
            <h1 className="title">Porcentaje {props.titulo}</h1>
            <MoreVertIcon fontSize="small"/>
        </div>
        <div className="bottom">
            <div className="featuredChart">
                <CircularProgressbar value={props.porcentaje} text={props.porcentaje+"%"} strokeWidth={5}/>
            </div>
            <p className="title">Porcentaje</p>
            <p className="amount">{props.titulo}</p>
        {/*      <p className="description">Descripcion</p>
            <div className="summary">
                 <div className="item">
                    <div className="itemTitle">titulo</div>
                    <div className="itemResult negative">
                        <KeyboardArrowDownIcon fontSize="small" />
                        <div className="resultAmount">Dato</div>
                    </div>
                </div>
              <div className="item">
                    <div className="itemTitle">titulo</div>
                    <div className="itemResult positive">
                        <KeyboardArrowUpIcon fontSize="small" />
                        <div className="resultAmount">Dato</div>
                    </div>
                </div>
                <div className="item">
                    <div className="itemTitle">titulo</div>
                    <div className="itemResult positive">
                        <KeyboardArrowUpIcon fontSize="small" />
                        <div className="resultAmount">Dato</div>
                    </div>
                </div> 
            </div>*/}
        </div>
    </div>
  )
}

export default Featured;