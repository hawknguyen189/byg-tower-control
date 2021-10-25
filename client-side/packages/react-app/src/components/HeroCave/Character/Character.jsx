import React, { useContext } from "react";
import Classes from "../../constants/ClassLore";
import { CharacterContext } from "../../Context/CharacterContext";

const Character = ({ heroID }) => {
  const { heroes } = useContext(CharacterContext);
  return (
    <div>
      {heroes[heroID] && (
        <div className="character-section my-4 px-2 py-2">
          <p style={{ whiteSpace: "pre-line" }}>
            {Classes[heroes[heroID].class.toLowerCase()].intro}
          </p>
        </div>
      )}
    </div>
  );
};

export default Character;
