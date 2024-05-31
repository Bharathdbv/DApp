import React, { useState } from "react";
import { ethers } from 'ethers';

const Connected = (props) => {
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [orders, setOrders] = useState({});

    async function placeOrder() {
        try {
            const signer = props.provider.getSigner();
            const contractInstance = new ethers.Contract(
                props.canteenAddress, props.canteenAbi, signer
            );

            const tx = await contractInstance.placeOrder(item, quantity, { value: quantity * props.menu[item] });
            await tx.wait();
            console.log("Order placed successfully!");
            updateOrders();
        } catch (error) {
            console.error("Error placing order:", error);
        }
    }

    async function updateOrders() {
        try {
            const contractInstance = new ethers.Contract(
                props.canteenAddress, props.canteenAbi, props.provider
            );

            const customerOrders = await contractInstance.getOrder(props.account, item);
            setOrders({ ...orders, [item]: customerOrders });
            console.log("Orders updated successfully:", orders);
        } catch (error) {
            console.error("Error updating orders:", error);
        }
    }

    function handleItemChange(e) {
        setItem(e.target.value);
    }

    function handleQuantityChange(e) {
        setQuantity(e.target.value);
    }

    return (
        <div className="connected-container">
            <h1 className="connected-header">Canteen Management</h1>
            <input type="text" placeholder="Item" value={item} onChange={handleItemChange} />
            <input type="number" placeholder="Quantity" value={quantity} onChange={handleQuantityChange} />
            <button onClick={placeOrder}>Place Order</button>
            <div>
                <h3>Orders:</h3>
                {Object.keys(orders).map((key, index) => (
                    <p key={index}>{key}: {orders[key]}</p>
                ))}
            </div>
        </div>
    );
}

export default Connected;