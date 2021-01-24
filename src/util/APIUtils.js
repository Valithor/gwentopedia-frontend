import { API_BASE_URL, TASK_LIST_SIZE, ACCESS_TOKEN } from '../constants';
import axios from 'axios';

const GWENT_ONE_KEY="zQSMgniirZRqYzCHTKIsrQ";
const config = {
    headers: { Authorization: 'Bearer ' + localStorage.getItem(ACCESS_TOKEN), }
};

export function getTaskTypes(){
    return axios.get(API_BASE_URL + "/tasktypes");
}
export async function getLeaders(){
    return axios.get(API_BASE_URL + "/leaders");
}
export function getRawCards(){
    return axios.get("https://cors-anywhere.herokuapp.com/https://gwent.one/api/cardlist?key="+ GWENT_ONE_KEY)
}

export function saveAnswer(taskId, answerData){
    return axios.post(API_BASE_URL + `/tasks/${taskId}/answers`, answerData, config);
}

export function getCards(page, size, faction){
    return axios.get(API_BASE_URL+ `/cards?page=${page}&size=${size}&faction=${faction}`);
}

export function getTaskTypeById(taskTypeId){
    return axios.get(API_BASE_URL + '/tasktypes/' + taskTypeId);
}
export function getTaskById(taskId){
    if(localStorage.getItem(ACCESS_TOKEN))
    return axios.get(API_BASE_URL + '/tasks/' + taskId, config);
    else
    return axios.get(API_BASE_URL + '/tasks/' + taskId);
}
export async function getAllTasks(page, size, difficulty="", leaderPl="", leaderOpp="") {
    page = page || 0;
    size = size || TASK_LIST_SIZE;
    if(localStorage.getItem(ACCESS_TOKEN))
    return axios.get(API_BASE_URL + "/tasks?page=" + page + "&size=" + size + "&difficulty=" + difficulty + "&leaderPl=" + leaderPl + "&leaderOpp=" + leaderOpp, config);
    else
    return axios.get(API_BASE_URL + "/tasks?page=" + page + "&size=" + size + "&difficulty=" + difficulty + "&leaderPl=" + leaderPl + "&leaderOpp=" + leaderOpp);
}

export async function getTasksAdmin(page, size) {
    page = page || 0;
    size = size || TASK_LIST_SIZE;
    return axios.get(API_BASE_URL + `/tasks/all?page=${page}&size=${size}`, config);
}
export async function getUsers(page, size){
    page = page || 0;
    size = size || TASK_LIST_SIZE;
    return axios.get(API_BASE_URL + `/users?page=${page}&size=${size}`, config);
}
export async function postTaskType(taskTypeData){
    return axios.post(API_BASE_URL + "/tasktypes", taskTypeData, config);
}
export async function deleteTask(taskId){
    return axios.delete(API_BASE_URL + `/tasks/${taskId}`, config);
}
export async function deleteUser(userId){
    return axios.delete(API_BASE_URL + `/users/${userId}`, config);
}
export async function promoteUser(userId, roleName){
    return axios.put(API_BASE_URL + `/user/promote/${userId}/${roleName}`, null, config);
}

export function createTask(taskData) {
    return axios.post(API_BASE_URL + "/tasks", taskData, config);
}
export function addTaskCards(taskCardData) {
    return axios.post(API_BASE_URL + "/tasks/cards", taskCardData, config);
}


export function createCard(cardData) {
    return axios.post(API_BASE_URL + "/cards", cardData, config);
}
// export function createLeader(leaderData) {
//     return axios.post(API_BASE_URL + "/leaders", leaderData, config);
// }


export function login(loginRequest) {
    return axios.post(API_BASE_URL + "/auth/signin", loginRequest);
}

export function signup(signupRequest) {
    return axios.post(API_BASE_URL + "/auth/signup", signupRequest);
}

export function checkUsernameAvailability(username) {
    return axios.get(API_BASE_URL + "/user/checkUsernameAvailability?username=" + username);
}
export function checkEmailAvailability(email) {
    return axios.get(API_BASE_URL + "/user/checkEmailAvailability?email=" + email);
}
export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }
    return axios.get(API_BASE_URL + "/user/me", config);
}
export function getUserProfile(username) {
    return axios.get(API_BASE_URL + "/users/" + username);
}

export function getUserCreatedTasks(username, page, size) {
    page = page || 0;
    size = size || TASK_LIST_SIZE;

    return axios.get(API_BASE_URL + "/users/" + username + "/tasks?page=" + page + "&size=" + size);
}

export function getUserAnsweredTasks(username, page, size) {
    page = page || 0;
    size = size || TASK_LIST_SIZE;

    return axios.get(API_BASE_URL + `/users/${username}/votes?page=${page}&size=${size}`);
}