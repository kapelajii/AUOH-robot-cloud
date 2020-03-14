const mqtt_client = mqtt.connect('wss://auoh20-mqtt-broker.herokuapp.com');
mqtt_client.on('connect', () => {
    console.log('connected to mqtt broker');
    mqtt_client.subscribe('joints') 
});
mqtt_client.on('message', (topic, message) => {
    const joint_data = JSON.parse(message)
    document.body.innerHTML = JSON.stringify(joint_data); 
});
            