import styles from "./Asteroid.module.scss";
import React, { useRef, useState } from "react";
import CustomPopover from "./Popover";
import { Typography } from "@material-ui/core";
import { ReactComponent as AsteroidSvg } from "../../../assets/svg/asteroid.svg";

const Asteroid = ({ id, name, x, y, source, sourceType, stake }) => {
  const ref = useRef();
  const [hover, setHover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id_popover = open ? "simple-popover" : undefined;

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <foreignObject x={x} y={y} width="12" height="6">
      <div
        className={styles.wrapper}
        ref={ref}
        onClick={handleClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <AsteroidSvg fontSize={4} stroke={hover || open ? "yellow" : "white"} />
        <Typography
          color="textPrimary"
          style={{ color: hover || open ? "yellow" : "white" }}
        >
          {name}
        </Typography>
      </div>
      {anchorEl !== null ? (
        <CustomPopover
          id={id_popover}
          source={source}
          sourceType={sourceType}
          stake={stake}
          astId={id}
          astName={name}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          transitionDuration={0}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        />
      ) : null}
    </foreignObject>
  );
};

export default Asteroid;
