import React from 'react';
import './footer.css';
import telegram from '../../images/icon_telegram.png';
import twitter from '../../images/icon_twitter.png';
import discord from '../../images/icon_discord.png';
import github from '../../images/icon_github.png';
import exchange from '../../images/icon_exchange.png';
import dextool from '../../images/icon_dextool.png';
import uniswap from '../../images/icon_uniswap.png';

function Footer() {

    return (
        <div className='footer'>
            {/* <ul>
                <li className="link-icon" >
                    <a href='https://t.me/DAOTitan' target='_blank' rel="noreferrer">
                        <img src={telegram} alt="Telegram" className="icon" />
                    </a>
                </li>
                <li className="link-icon" >
                    <a href='https://twitter.com/TITAN0112' target='_blank' rel="noreferrer">
                        <img src={twitter} alt="Twitter" className="icon" />
                    </a>
                </li>
                <li className="link-icon" >
                    <a href='https://discord.gg/3fFrrD3D' target='_blank' rel="noreferrer">
                        <img src={discord} alt="Discord" className="icon" />
                    </a>
                </li>
                <li className="link-icon" >
                    <a href='https://github.com/TITAN-Vault/Contracts' target='_blank' rel="noreferrer">
                        <img src={github} alt="Github" className="icon" />
                    </a>
                </li>
                <li className="link-icon" >
                    <a href='https://app.uniswap.org/#/swap?outputCurrency=0x983C059D1be984F8f06C2559351C5ab1CB1dcDb7' target='_blank' rel="noreferrer">
                        <img src={exchange} alt="Exchange" className="icon" />
                    </a>
                </li>
                <li className="link-icon" >
                    <a href='https://www.dextools.io/app/uniswap/pair-explorer/0x06aC948b796042d8ff52792899da16d9C690E41b' target='_blank' rel="noreferrer">
                        <img src={dextool} alt="Dextools" className="icon" />
                    </a>
                </li>
                <li className="link-icon" >
                    <a href='https://info.uniswap.org/token/0x983C059D1be984F8f06C2559351C5ab1CB1dcDb7' target='_blank' rel="noreferrer">
                        <img src={uniswap} alt="Uniswap" className="icon" />
                    </a>
                </li>
            </ul> */}
        </div>
    );

}

export default Footer;