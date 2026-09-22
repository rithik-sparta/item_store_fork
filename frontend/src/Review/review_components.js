import {useState} from "react"
import {useAuth} from "../components/is_authenticated_component"
import {url} from "../constants"
import PaginatedView from "../components/paginated_component"
import {getHeaders, process_errors} from "../utils"
import { DisplayMessage } from "../components/errorView"

export function ReviewForm(props){

    const {isAuthenticated} = useAuth()

    const [formData,setFormData] = useState({
        "rating" : 1,
        "comment" : ""
    })


    const [message, setMessage] = useState([])
    const [isError, setError ] = useState(false)

    async function submitHandler(event){
        event.preventDefault()
        const controller = new AbortController();
        const abort_signal = controller.signal
        let response
        let json

        try{
            response = await fetch(url+"/reviews/",
                {
                    method : "POST",
                    mode : 'cors',
                    headers : getHeaders(),
                    credentials : "include",
                    signal : abort_signal,
                    body : JSON.stringify({
                        "product": props.product,
                        "comment": formData.comment,
                        "rating": formData.rating
                    })
                }
            )
            json = await response.json()

            if (!response.ok){
                throw Error(JSON.stringify(json))
            }
            alert('Review Submitted')
            props.submitted(true)
            setMessage(["Review Submitted"])
            setFormData(data => ({...data,rating:1,comment:""}))
        }catch (error){
            console.error(error)
            if (json){
                let error_messages = process_errors(json)
                setMessage(error_messages)
                setError(true)
            }
        }
        return () => {controller.abort()}
    }

    const handleChange = (event) => {
        event.preventDefault()
        setFormData(values => ({...formData,[event.target.name] : event.target.value}))
    }

    return (
        isAuthenticated && 
        <>
        <form onSubmit={submitHandler}>
            <div className="d-flex flex-column align-items-start bg-info ps-3 input group input-group-lg">
                <label className="fw-bold">Rating</label>
                <input type="number" name="rating" min="1" max="5" value={formData.rating} onChange={handleChange}></input>
                <label className="fw-bold">Review</label>
                <input className="input-group-text" type="text" name="comment" value={formData.comment} onChange={handleChange}></input>
                <button type="submit" className="btn border border-info my-2 bg-primary">Create Review</button>
            </div>
        </form>
        <div className={isError ? 'text-danger' : 'text-success'}>
            <DisplayMessage messages={message}/>
        </div>
        </>
    )

}

function ReviewCard(props){
    const date = props.values.date ? new Date(props.values.date).toLocaleString() : 'Unknown date'
    return (
        <div className="w-50 pb-5 border rounded">
            <h2>{props.values['customer']['username']}, {'★'.repeat(parseInt(props.values['rating']))}</h2>
            <p className="text-muted">Reviewed on: {date}</p>
            <h3>{props.values['comment']}</h3>
        </div>
        )
}

export function Reviews(props){
    const endpoint = `${url}/reviews/${props.product}/?sort_by=${props.sortBy || 'date'}&order=${props.sortOrder || 'desc'}`
    return <PaginatedView rerender={props.rerender} endpoint={endpoint} displayClass={"d-flex justify-content-center align-items-center flex-column border-top border-primary h-50 overflow-scroll"} item={(key,values) => <ReviewCard key={key} values={values}/>}/>
}

export function ReviewsComponent({product}){
    const [rerender, setRerender] = useState(false)
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState('desc')
    const {isAuthenticated} = useAuth()

    return (
        <>
            <div className="d-flex gap-3 align-items-center my-3">
                <label>
                    Sort by:
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="ms-2">
                        <option value="date">Date</option>
                        <option value="rating">Rating</option>
                    </select>
                </label>
                <label>
                    Order:
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="ms-2">
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
            </div>
            {isAuthenticated && <ReviewForm product={product} submitted={setRerender}/>}
            <Reviews rerender={rerender} product={product} sortBy={sortBy} sortOrder={sortOrder}/>
        </>
    )
}