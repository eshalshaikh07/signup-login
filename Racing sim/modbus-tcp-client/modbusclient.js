const ModbusRTU = require('modbus-serial');
const client = new ModbusRTU();

const SERVER_IP = '192.168.0.10';  // Replace with your Modbus server IP
const SERVER_PORT = 502;          // Replace with your Modbus server port

const HELLO_WORLD = 'Hello World';

// Convert the string to an array of 16-bit integers (Modbus registers)
const stringToRegisters = (str) => {
    const buffer = Buffer.from(str, 'utf8');
    const registers = [];
    for (let i = 0; i < buffer.length; i += 2) {
        registers.push(buffer[i] << 8 | (buffer[i + 1] || 0));
    }
    return registers;
};

// Function to write the "Hello World" message to the Modbus server
const writeHelloWorld = async () => {
    try {
        // Connect to the Modbus TCP server
        await client.connectTCP(SERVER_IP, { port: SERVER_PORT });
        console.log('Connected to Modbus server');

        // Set the ID of the Modbus server (slave)
        client.setID(1);

        // Convert the "Hello World" string to Modbus registers
        const registers = stringToRegisters(HELLO_WORLD);

        // Write the registers to the Modbus server starting at address 0
        await client.writeRegisters(0, registers);
        console.log('Written "Hello World" to Modbus server');

        // Close the connection
        client.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

// Execute the function
writeHelloWorld();
