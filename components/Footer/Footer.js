import Link from 'next/link';
import SubscribeForm from '../Forms/SubscribeForm';
import { FOOTER_LINKS } from '../../Constants';

const Footer = () => {
    return (
        <footer className="footer-area border-top">
            {/* Footer Top */}
            <div className="footer-top">
                <div className="container">
                    <div className="row text-center text-sm-start">
                        <div className="col-12 col-sm-6 col-lg-4 res-margin">
                            {/* Footer Items */}
                            <div className="footer-items">
                                {/* Footer Title */}
                                <h4 className="footer-title">Get the latest Renovi updates</h4>
                                {/* Subscribe Form */}
                                <SubscribeForm />
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-lg-3 res-margin">
                            {/* Footer Items */}
                            <div className="footer-items">
                                {/* Footer Title */}
                                <h4 className="footer-title">{FOOTER_LINKS.widget_1.title}</h4>
                                <ul>
                                    {FOOTER_LINKS.widget_1.data.map((item, idx) => {
                                        return (
                                            <li key={`wdo_${idx}`}><Link href={item.link}><a className="text-secondary-alt">{item.text}</a></Link></li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-lg-3 res-margin">
                            {/* Footer Items */}
                            <div className="footer-items">
                                {/* Footer Title */}
                                <h4 className="footer-title">{FOOTER_LINKS.widget_2.title}</h4>
                                <ul>
                                    {FOOTER_LINKS.widget_2.data.map((item, idx) => {
                                        return (
                                            <li key={`wdo_${idx}`}><Link href={item.link}><a className="text-secondary-alt">{item.text}</a></Link></li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-lg-2">
                            {/* Footer Items */}
                            <div className="footer-items">
                                {/* Footer Title */}
                                <h4 className="footer-title">{FOOTER_LINKS.widget_3.title}</h4>
                                <ul>
                                    {FOOTER_LINKS.widget_3.data.map((item, idx) => {
                                        return (
                                            <li key={`wdo_${idx}`}><Link href={item.link}><a className="text-secondary-alt">{item.text}</a></Link></li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center">
                            {/* Copyright Area */}
                            <a className="social-media "href="https://t.me/RenoviNFTGroup"><img className="mx-2" width="30px" src="/images/icons/telegram.svg" alt="telegram icon" /></a>
                            <a className="social-media" href="https://twitter.com/RenoviNFT"><img className="mx-2" width="30px" src="/images/icons/twitter.svg" alt="twitter icon" /></a>
                            <a className="social-media" href="https://www.instagram.com/renovinft/"><img className="mx-2" width="30px" src="/images/icons/ig.svg" alt="instagram icon" /></a>
                            <a className="social-media" href="https://discord.gg/pBtQyqVN"><img className="mx-2" width="30px" src="/images/icons/discord.svg" alt="discord icon" /></a>
                            <div className="copyright-area d-flex flex-wrap justify-content-center text-center py-4">
                                <p className="fw-normal text-secondary-alt">Renovi ©  {(new Date().getFullYear())} | Site by 
                                    <a href="https://mojodigital.io" className="ps-2" target="_blank">Mojo Digital</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
