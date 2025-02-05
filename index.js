import { ethers } from 'ethers';
import fs from 'fs';
import readline from 'readline';
import chalk from 'chalk';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showBanner() {
    console.log(chalk.cyan(`
    ███████╗██╗   ██╗███╗   ███╗    ██████╗ ██╗   ██╗██╗     ██╗  ██╗
    ██╔════╝██║   ██║████╗ ████║    ██╔══██╗██║   ██║██║     ██║ ██╔╝
    █████╗  ██║   ██║██╔████╔██║    ██████╔╝██║   ██║██║     █████╔╝ 
    ██╔══╝  ╚██╗ ██╔╝██║╚██╔╝██║    ██╔══██╗██║   ██║██║     ██╔═██╗ 
    ███████╗ ╚████╔╝ ██║ ╚═╝ ██║    ██████╔╝╚██████╔╝███████╗██║  ██╗
    ╚══════╝  ╚═══╝  ╚═╝     ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝
     ███████╗███████╗███╗   ██╗██████╗ 
     ██╔════╝██╔════╝████╗  ██║██╔══██╗
     ███████╗█████╗  ██╔██╗ ██║██║  ██║
     ╚════██║██╔══╝  ██║╚██╗██║██║  ██║
     ███████║███████╗██║ ╚████║██████╔╝
     ╚══════╝╚══════╝╚═╝  ╚═══╝╚═════╝ 
    `));
    console.log(chalk.yellow('    🚀 EVM Bulk Send v1.0.0'));
    console.log(chalk.gray('    ----------------------------------------'));
    console.log(chalk.gray('    Created by github.com/baihaqism'));
    console.log(chalk.gray('    ----------------------------------------\n'));
}

async function distributeEth(sourcePrivateKey, provider, addresses, amountPerAddress) {
    try {
        const wallet = new ethers.Wallet(sourcePrivateKey, provider);
        console.log(chalk.cyan(`\nSource wallet address: ${wallet.address}`));
        
        const balance = await provider.getBalance(wallet.address);
        const totalNeeded = ethers.parseEther(amountPerAddress.toString()) * BigInt(addresses.length);
        
        if (balance < totalNeeded) {
            throw new Error(`Insufficient balance. Have: ${ethers.formatEther(balance)} ETH, Need: ${ethers.formatEther(totalNeeded)} ETH`);
        }

        console.log(chalk.yellow('\nStarting distributions...'));
        
        for (let i = 0; i < addresses.length; i++) {
            const tx = await wallet.sendTransaction({
                to: addresses[i],
                value: ethers.parseEther(amountPerAddress.toString())
            });
            
            console.log(chalk.green(`\n✓ Sent ${amountPerAddress} ETH to ${addresses[i]}`));
            console.log(chalk.gray(`Transaction hash: ${tx.hash}`));
            
            await tx.wait();
        }
        
        console.log(chalk.green('\n✅ All distributions complete!'));
        
    } catch (error) {
        console.log(chalk.red(`\n❌ Error: ${error.message}`));
    }
}

async function main() {
    console.clear();
    showBanner();

    try {
        const rpcUrl = await new Promise((resolve) => {
            rl.question(chalk.green('\nEnter RPC URL: '), resolve);
        });
        
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        
        const sourceKey = await new Promise((resolve) => {
            rl.question(chalk.green('Enter source wallet private key: '), resolve);
        });

        const sourceBalance = await provider.getBalance(new ethers.Wallet(sourceKey).address);
        console.log(chalk.yellow(`Source wallet balance: ${ethers.formatEther(sourceBalance)} ETH`));

        const amountPerAddress = await new Promise((resolve) => {
            rl.question(chalk.green('\nEnter ETH amount to send to each address: '), resolve);
        });

        const addresses = fs.readFileSync('wallet.txt', 'utf8')
            .split('\n')
            .map(addr => addr.trim())
            .filter(addr => addr && ethers.isAddress(addr));

        if (addresses.length === 0) {
            throw new Error('No valid addresses found in wallet.txt');
        }

        console.log(chalk.cyan(`\nFound ${addresses.length} valid addresses`));
        
        await distributeEth(sourceKey, provider, addresses, parseFloat(amountPerAddress));

    } catch (error) {
        console.log(chalk.red(`\n❌ Error: ${error.message}`));
    } finally {
        rl.close();
    }
}

main();