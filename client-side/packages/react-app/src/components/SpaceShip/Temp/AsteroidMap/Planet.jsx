import styles from "./Planet.module.scss";
import classNames from "classnames";
import { Typography } from "@material-ui/core";
// import {ReactComponent as PlanetSvg} from '../../assets/svg/planet1.svg'

const Planet = (props) => {
  const { plt_name, plt_status, plt_x, plt_y } = props;
  const x_proc = plt_x;
  const y_proc = plt_y;

  return (
    <foreignObject x={x_proc} y={y_proc} width="40" height="40">
      <div className={styles.wrapper}>
        {plt_status === 0 ? (
          <button className={classNames(styles.star, styles.disabled)} />
        ) : (
          <button className={classNames(styles.star)} />
        )}
        <Typography color="textPrimary" className={classNames(styles.label)}>
          {plt_name}
        </Typography>
      </div>
    </foreignObject>
  );
};

export default Planet;
