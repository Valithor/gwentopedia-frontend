import { useEffect, useState } from 'react'
import { getCards, getAllTasks, getUserAnsweredTasks, getUserCreatedTasks, getTasksAdmin, getUsers} from '../util/APIUtils';

export default function useCardSearch(pageNumber, size, type, text = 'all', taskFilters = null) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [elems, setElems] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setElems([])
  }, [text, taskFilters])

  const filterType=(name)=>{
    setElems(elems.filter(task => task.taskType.name ==name));
 }

  useEffect(() => {
    setLoading(true)
    setError(false)
    let promise;
    if(type==='cards')
    promise=getCards(pageNumber, size, text)
    if(type==='created')
    promise = getUserCreatedTasks(text, pageNumber, size); 
    if(type==='answered')
    promise = getUserAnsweredTasks(text, pageNumber, size); 
    if(type==='allTasks'){
      const {difficulty, leaderPl, leaderOpp} = taskFilters;
      promise=getAllTasks(pageNumber, size, difficulty, leaderPl, leaderOpp)
    }
    if(type==='tasks')
    promise = getTasksAdmin(pageNumber, size); 
    if(type==='users')
    promise = getUsers(pageNumber, size); 

    promise.then(res => {
      setElems(prevElems => {
        return [...new Set([...prevElems, ...res.data.content.map(elem => elem)])]
      })
      setHasMore(res.data.content.length > 0)
      setLoading(false)
    })     
  }, [ pageNumber])

  return { loading, error, elems, hasMore, filterType }
}