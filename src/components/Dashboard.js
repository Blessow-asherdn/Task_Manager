import './TaskManager.css';
import {useState,useEffect} from "react";
import {useNavigate} from 'react-router-dom';

const Dashboard = () => { 
    const [tasks,setTasks]=useState([]);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(()=>{
        if(!token){
            navigate('/');
        }
    },[]);

    const showMessage = (msg, type = "success") => {
        setMessage({ text: msg, type });

        setTimeout(() => {
            setMessage({ text: "", type: "" });
        }, 2000);
    };

    useEffect(() => {
        const msg = localStorage.getItem("message");
        if (msg) {
            showMessage(msg);
            localStorage.removeItem("message");
        }
    }, []);

    useEffect(()=>{
        const fetchTasks = async()=>{
            try{
                setLoading(true);
                const res = await fetch(`http://localhost:5000/api/tasks`,{
                    headers: {"Authorization": `Bearer ${token}`}
                });
                const data = await res.json();
                if(!res.ok){
                    showMessage(data.message, "error");
                    return;
                }
                setTasks(data.data);
            }catch(err){
                showMessage("Failed to fetch Task", "error");
            }finally{
                setLoading(false);
            }
        };
        fetchTasks();
    },[]);

    const deleteTask =async (id)=>{
        try{
            const res = await fetch(`http://localhost:5000/api/tasks/${id}`,{
                method: "DELETE",
                headers: {'Content-Type':'application/json',
                            "Authorization": `Bearer ${token}`},
            });
            const data = await res.json();
            if(!res.ok){
                showMessage(data.message, "error");
                return;
            }

            setTasks(tasks.filter(task=>task._id!==id)); 
            showMessage("Task deleted successfully");
        }catch(err){
            showMessage("Failed to delete Task", "error");
        }
    }

    const completedTask = async(id)=>{
        try{
            const res = await fetch(`http://localhost:5000/api/tasks/${id}`,{
                method: "PUT",
                headers: {'Content-Type':'application/json',
                            "Authorization": `Bearer ${token}`},
                body: JSON.stringify({status:"completed"})
            });
            const data = await res.json();
            if(!res.ok){
                showMessage(data.message, "error");
                return;
            }
            setTasks(tasks.map(task=>task._id===id?{...task,status:"completed"}:task));
            showMessage("Task marked as completed");
        }catch(err){
            showMessage("Failed to update Task", "error");
        }
    };

    const logout = () =>{
        localStorage.removeItem('token');
        localStorage.setItem("message", "Logged out successfully");
        navigate('/');
    };

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            {message.text && (
                <p style={{ color:message.type === "error" ? "red" : "green" }}>
                    {message.text}
                </p>
            )}
            {loading ?(
                 <p>Loading Tasks...</p> ):
            tasks.length===0? 
            <p>No Tasks Available.Add your Tasks</p> : 
            tasks.map(task=>(
                <div key ={task._id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>Status :{task.status}</p>
                    <button onClick={()=>deleteTask(task._id)}>Delete Task</button>
                    <button onClick={()=>completedTask(task._id)}>Mark as Completed</button>
                </div>
            ))
            }
            <button onClick={()=>navigate('/add_task')}>Add Task</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Dashboard;