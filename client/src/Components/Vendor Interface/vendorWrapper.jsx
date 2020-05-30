import React, { useEffect} from 'react';
import Vendor from './Vendor';
import openSocket from 'socket.io-client';
import AddServiceStation from './AddServiceStation';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux'
import { useState } from 'react';

const VendorWrapper = props => {
    const [state, setState] = useState({
        render: null
    })
    const userAuth = useSelector(st => st.userAuth);
    useEffect(()=>{
        if((!userAuth.isAuthenticated || userAuth.userType !== 'vendor') && userAuth.userLoaded)
        {
            props.history.replace('login');
        }
        if(userAuth.userLoaded && userAuth.isAuthenticated && userAuth.userType === 'vendor'){
            const vendorio = openSocket('http://localhost:5000');
            vendorio.emit('vendor', {
                vendorID: userAuth.vendor._id,
                msg: "Hi I am Vendor"
            });
            vendorio.on('vendorIO', res => {
                console.log(res, "Called");
                if(!res.ssExist && state.render === null){
                    setState({
                        render: <AddServiceStation/>
                    })
                }
                else if(!res.ssExist && state.render === null){
                    setState({
                        render: <Vendor/>
                    })
                }
            })
            vendorio.on('VendorNotification', res => {
                console.log(res);
            })
        }
    })  
    
    return state.render;
}
export default VendorWrapper;