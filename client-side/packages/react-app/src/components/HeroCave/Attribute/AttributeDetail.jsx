import React from "react";

const AttributeDetail = () => {
  return (
    <div className="col-sm-7 py-3">
      <ul className="nav nav-fill nav-pills" id="attributeTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link fw-bolder text-white active"
            id="strength-tab"
            data-bs-toggle="tab"
            data-bs-target="#strength"
            type="button"
            role="tab"
            aria-controls="strength"
            aria-selected="true"
          >
            Strength
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link fw-bolder text-white"
            id="dexterity-tab"
            data-bs-toggle="tab"
            data-bs-target="#dexterity"
            type="button"
            role="tab"
            aria-controls="dexterity"
            aria-selected="true"
          >
            Dexterity
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link fw-bolder text-white"
            id="constitution-tab"
            data-bs-toggle="tab"
            data-bs-target="#constitution"
            type="button"
            role="tab"
            aria-controls="constitution"
            aria-selected="false"
          >
            Constitution
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link fw-bolder text-white"
            id="intelligence-tab"
            data-bs-toggle="tab"
            data-bs-target="#intelligence"
            type="button"
            role="tab"
            aria-controls="intelligence"
            aria-selected="false"
          >
            Intelligence
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link fw-bolder text-white"
            id="wisdom-tab"
            data-bs-toggle="tab"
            data-bs-target="#wisdom"
            type="button"
            role="tab"
            aria-controls="wisdom"
            aria-selected="false"
          >
            Wisdom
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link fw-bolder text-white"
            id="charisma-tab"
            data-bs-toggle="tab"
            data-bs-target="#charisma"
            type="button"
            role="tab"
            aria-controls="charisma"
            aria-selected="false"
          >
            Charisma
          </button>
        </li>
      </ul>
      <div className="tab-content pt-3" id="attributeTabContent">
        <div
          className="tab-pane fade show active container text-light text-opacity-75"
          id="strength"
          role="tabpanel"
          aria-labelledby="strength-tab"
        >
          <h6 className="fst-italic">Strength</h6>
          <p>
            Strength governs how much Armor a character has and increases
            Barbarian's, Fighter's, and Paladin's damage dealt.
          </p>
          <p>
            Each point of Strength gives: +1 Armor. +1% damage for above
            classes.
          </p>
        </div>
        <div
          className="tab-pane fade show container text-light text-opacity-75"
          id="dexterity"
          role="tabpanel"
          aria-labelledby="dexterity-tab"
        >
          <h6 className="fst-italic">Dexterity</h6>
          <p>
            Increases all Rouge, Monk, and Ranger damage by 1% per point, and
            armor for all classes by 1 per point
          </p>
        </div>
        <div
          className="tab-pane fade container text-light text-opacity-75"
          id="constitution"
          role="tabpanel"
          aria-labelledby="constitution-tab"
        >
          <h6 className="fst-italic">Constitution</h6>
          <p>Constitution governs the amount of Life a character has.</p>
          <h6>Each point of Constitution gives:</h6>
          <ul>
            <li>+x Life</li>
            <ul>
              <li>If player's Fantom level &#60; 35, x = 10.</li>
              <li>If player's Fantom level ≥ 35, x = Level − 25.</li>
            </ul>
            <p>
              At level 60, each point of Constitution adds 35 life. This does
              not include 36 base life and +4 life per level.
            </p>
          </ul>
          <ul>
            <li>Total Life is calculated as follows:</li>
            <ul>
              <li>
                If player's Fantom level &#60; 35, Life = Constitution × 10 +
                Level × 4 + 36
              </li>
              <li>
                If player's Fantom level ≥ 35, Life = Constitution × (Level −
                25) + Level × 4 + 36
              </li>
            </ul>
          </ul>
        </div>
        <div
          className="tab-pane fade container text-light text-opacity-75"
          id="intelligence"
          role="tabpanel"
          aria-labelledby="intelligence-tab"
        >
          <h6 className="fst-italic">Intelligence</h6>
          <p>
            Intelligence increases a character's Resistances and increases
            Wizard's, Sorcerer's, and Cleric's damage dealt.
          </p>
          <p>
            Each point of Intellect gives: +0.1 to all Resistances. +1% damage
            for Sorcerers, Wizards, and Clerics.
          </p>
        </div>
        <div
          className="tab-pane fade container text-light text-opacity-75"
          id="wisdom"
          role="tabpanel"
          aria-labelledby="wisdom-tab"
        >
          <h6 className="fst-italic">Wisdom</h6>
          <p>
            Wisdom describes a character’s willpower, common sense, perception,
            and intuition. While Intelligence represents one’s ability to
            analyze information, Wisdom represents being in tune with and aware
            of one’s surroundings.
          </p>
          <br />
          <p>
            Wisdom governs the Attack & Ultra-Instinct rating of the character.
          </p>
          <p>The Attack Rating defines as below</p>
          <ul>
            <li>
              Attack Rating: determines the percentage chance that you will hit
              the target, as well as the chance of the targeted monster hitting
              the player. If your Attack Rating is too low, you will notice that
              your attacks often miss. The chance to hit increases if you are at
              a higher character level than the monster you're attacking. Your
              Attack Rating can be improved by increasing your Wisdom, and by
              equipping magic items that specifically increase your Attack
              Rating.
            </li>
            <li>
              This chance starts at a base of 50%, and is increased by 1 for
              every 2 points allocated into Wisdom for melee/ranged/magical
              attacks.
            </li>
          </ul>
          <p>The Ultra-Instinct Rating defines as below</p>
          <ul>
            <li>
              Ultra-Instinct is a character ability that allows players to
              completely avoid taking damage from some types of attacks, both
              physical and magical ones.
            </li>
            <li>
              This chance starts at a base of 5%, and is increased by 1 for
              every 2 points allocated into Wisdom.
            </li>
          </ul>
        </div>
        <div
          className="tab-pane fade container text-light text-opacity-75"
          id="charisma"
          role="tabpanel"
          aria-labelledby="charisma-tab"
        >
          <h6 className="fst-italic">Charisma</h6>
          <p>
            Charisma measures a character’s force of personality,
            persuasiveness, personal magnetism, ability to lead, and physical
            attractiveness. This ability represents actual strength of
            personality, not merely how one is perceived by others in a social
            setting.
          </p>
          <br />
          <p>
            It helps increase the successfull rate of Druid's Persuade skill
            (converting 1 animal/treant enemy into ally) or Evil Cleric's Turn
            Undead skill (control undead type enemy)
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttributeDetail;
