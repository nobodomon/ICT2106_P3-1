import React from "react"
import DatapageLayout from "../PageLayout"


function Clock(){
    //this is a hook 
    //the second part is the initial value
    //time is the variable
    //setTime is the function that changes the value of the variable
    const[time, setTime] = useState(new Date().toString()); //this is a hook 



    //life cycle hook
    //this is for when the component is updated we can run some side effect
    //use effect is to only run a fucntion if this state changes so it does not alwasy run --> intensive
    useEffect(() => {
        //this is the function that runs when the component is loaded
        
        const interval = setInterval(showDate, 1000);
        // console.log("component loaded");

        return () => {
            // console.log("Cleanup of Interval")
            clearInterval(interval);
        }

    }, [time] );//this is the dependency array];
    
    function showDate(){

        setTime(new Date().toString());
    }
    
    //RETURN the variable in this case it is time
    return <div>{time}</div>

}

export default Clock;