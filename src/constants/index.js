export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gwentopedia-backend.herokuapp.com/api';
export const ACCESS_TOKEN = 'accessToken';

export const TASK_LIST_SIZE = 10;

export const NAME_MIN_LENGTH = 4;
export const NAME_MAX_LENGTH = 40;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 15;

export const EMAIL_MAX_LENGTH = 40;

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 20;

export const DIFFICULTIES = [{name: "Very Easy"}, {name: "Easy"}, {name: "Intermediate"}, {name: "Hard"}, {name: "Very Hard"}];
export const DIFFICULTIES_TO_VALUES = {VeryEasy: 1, Easy: 2, Intermediate: 3, Hard: 4, VeryHard:5};
export const FACTIONS = ["Northern Realms", "Nilfgaard", "Monster", "Scoiatael", "Skellige", "Syndicate", "Neutral"];
export const SIDES = [{name: "Player Hand"}, {name: "Player Ranged"}, {name: "Player Melee"}, {name: "Opp Melee"}, {name: "Opp Ranged"}];
