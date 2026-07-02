const Characters = {
    'professor_quantum': {
        name: 'Professor Quantum',
        description: 'A brilliant scientist who can manipulate probabilities.',
        passiveAbility: 'Scientific Certainty: Never rolls a 1.',
        startMoneyModifier: 1,
        portrait: 'assets/images/portraits/professor_quantum.svg',
        getAbility: () => ({
            type: 'dice_roll_modifier',
            minRoll: 2
        })
    },
    'baroness_von_hertz': {
        name: 'Baroness von Hertz',
        description: 'A wealthy industrialist with a knack for making money.',
        passiveAbility: 'Golden Parachute: Starts with 50% more money.',
        startMoneyModifier: 1.5,
        portrait: 'assets/images/portraits/baroness_von_hertz.svg',
        getAbility: () => null
    },
    'beatrix_bixby': {
        name: "Beatrix 'Bix' Bixby",
        description: 'A charming socialite who always finds a shortcut.',
        passiveAbility: 'Secret Shortcut: Once per game, can move an extra 3 spaces.',
        startMoneyModifier: 1,
        portrait: 'assets/images/portraits/beatrix_bixby.svg',
        getAbility: () => ({
            type: 'extra_move',
            uses: 1,
            amount: 3
        })
    },
    'mad_max_mcguire': {
        name: "'Mad' Max McGuire",
        description: 'A reckless daredevil who thrives on chaos.',
        passiveAbility: 'Daredevil\'s Luck: Immune to the first negative event from Dr. Drago.',
        startMoneyModifier: 1,
        portrait: 'assets/images/portraits/mad_max_mcguire.svg',
        getAbility: () => ({
            type: 'drago_immunity',
            uses: 1
        })
    }
};

export default Characters;
