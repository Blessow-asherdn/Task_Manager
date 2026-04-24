import './TaskManager.css';
import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const Home = () => {
    const [username,setusername] = useState('');
    const [password,setpassword] = useState('');
    const [isLogin,setisLogin] = useState(true);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

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
    
    const handleSubmit = async(e) =>{
        e.preventDefault();

        setLoading(true);

        const url = isLogin? 'http://localhost:5000/api/auth/login':'http://localhost:5000/api/auth/register';
        try{
            const res = await fetch(url,{
                method: 'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    username:username.trim(),
                    password:password.trim()
                })
            });
            const info = await res.json();
            if(!res.ok){
                showMessage(info.message, "error");
                return;
            }
            if(isLogin){
                localStorage.setItem("token",info.data.token);
                localStorage.setItem("message", "Login successful");
                navigate('/dashboard');
            }else{
                showMessage("Account created successfully","success");
                setisLogin(true);
            }
        }catch(err){
            showMessage("Something went wrong", "error");
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="home">
            <h2>{isLogin? 'Task Manager Login': 'Task Manager Register'}</h2>
            {message.text && (
                <p style={{ color: message.type === "error" ? "red" : "green" }}>
                    {message.text}
                </p>
            )}
            <form onSubmit={handleSubmit}>
                <label>UserName</label>
                    <input type="text" placeholder="Enter Username" value={username} 
                    onChange={
                        (e) => setusername(e.target.value)
                    }/>
                <br></br>
                <label>Password</label>
                    <input type="password" placeholder="Enter Password" value={password} 
                    onChange = {
                        (e)=>setpassword(e.target.value)
                    } />
                <br></br>
                <button type="submit">{isLogin? 'Login':'Register'}</button>
                <h5>{isLogin?"Don't have an account? " :"Already have an account? "}
                    <span onClick={
                        ()=>setisLogin(!isLogin)
                    } 
                    style={{
                        color:'blue',
                        textDecoration:'underline',
                        cursor:'pointer'}}>
                    {isLogin? 'Register':'Login'}
                    </span>
                </h5>
            </form> 
        </div>
    );
};

export default Home;