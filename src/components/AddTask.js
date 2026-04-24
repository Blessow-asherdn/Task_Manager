import './TaskManager.css';
import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';


const AddTask = () => {
    const [title,setTitle]=useState('');
    const [description,setDescription]= useState("");
    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); 

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, []);

    const addingtask = async(e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        try{
            const res = await fetch('http://localhost:5000/api/tasks',{
                method: "POST",
                headers: {'Content-Type':'application/json',
                           "Authorization": `Bearer ${token}`},
                body: JSON.stringify({title,description})
            });
            const data = await res.json();
            if(!res.ok){
                setError(data.message);
                return;
            }
            localStorage.setItem("message", "Task added successfully");
            navigate('/dashboard');
        }catch(err){
            setError("Failed to add task");
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="add-task">
            <h2>Add Task</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={addingtask}>
                <label>Title:</label><input type='text' value = {title} onChange={(e)=>setTitle(e.target.value)} required/><br></br>
                <label>Description:</label><textarea value={description} onChange={(e)=>setDescription(e.target.value)} required></textarea><br></br>
                <button type='submit'>Add Task</button>
            </form>
        </div>
    );
};

export default AddTask;