import React from "react";
import { history } from "../../store/history";
import { HeaderMain } from "./headermain";
import { FooterMain } from "./footermain";
import { makeStyles } from '@material-ui/core/styles';

export const mainMenu = ({})=>{
 
    const style = makeStyles((theme) =>({
        heroContainer: {
            background: 'url('+require("../assets/logoWelcome.jpeg").default+') 50%/cover no-repeat',
            height: '80vh',
            width: '100%',
            display:'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow:'inset 0 0 0 1000px rgba(0,0,0,.2)',
            objectFit: 'contain',
        },
        special: {
            color: 'black',
            fontFamily: 'Proxima',
            textAlign: 'center',
            fontSize: 'calc(21.42857px + 1.57857vw)',
            lineHeight: '1.2em!important',
            wordWrap: 'break-word',
            hyphens: 'auto',
        },
        cards: {
            padding: '4rem',
            background:'#fff',
        },
        cardContainer: {
            display: 'flex',
            flexFlow: 'column',
            alignItems: 'center',
            maxWidth: '1120px',
            width: '90%',
            margin: '0 auto',
        },
        cardsWrapper: {
            position: 'relative',
            margin: '50px 0 45px',
        },
        cardsItems: {
            marginBottom: '24px',
            "@media only screen and (min-width:1024px)":{
                display: 'flex'
            }
        },
        cardsItem: {
            display: 'flex',
            flex: '1 1',
            margin: '0 1rem',
            borderRadius: '10px',
            "@media only screen and (min-width:1024px)":{
                marginBottom: '2rem'
            }
        },
        cards__item__link: {
            display: 'flex',
            flexFlow: 'column',
            width: '100%',
            boxShadow: '0 6px 20px rgba(56,125,255,.17)',
            filter: 'drop-shadow(0 6px 20px rgba(56,125,255,.017))',
            borderRadius: '10px',
            overflow: 'hidden',
            textDecoration: 'none',
        },
        cards__item__picWrap: {
            position: 'relative',
            width: '100%',
            paddingTop: '67%',
            overflow: 'hidden',
            '&:after':{
                content: 'attr(data-category)',
                position: 'absolute',
                bottom: '0',
                marginLeft: '10px',
                padding: '6px 8px',
                maxWidth: 'calc((100%) - 60px)',
                fontSize: '20px',
                fontWeight: '800',
                color: '#fff',
                backgroundColor: '#000000',
                boxSizing: 'border-box',
                fontFamily: 'Proxima',
            }
        },
        cards__item__img :{
            position: 'absolute',
            top: '0',
            right: '0',
            bottom: '0',
            left: '0',
            display: 'block',
            width: '100%',
            maxWidth: '100%',
            height: '100%',
            maxHeight: '100%',
            objectFit: 'cover',
            transition: 'all .2s linear',
            '&:hover':{transform: 'scale(1.1)'}
        },
        cards__item__info: {
            padding: '20px 30px 30px',
        },
        cards__item__text: {
            color: '#000',
            fontSize: '26px',
            lineHeight: '24px',
            fontFamily: 'ProximaSemiBold',
        }
    }))

    const classes = style();

    return(<><HeaderMain/>
              <div className={classes.heroContainer}>
              </div>
              <div className={classes.cards}>
                 <h1 className={classes.special}>Explora los 6 sistemas</h1>
                 <div className={classes.cardContainer}>
                    <div className={classes.cardsWrapper}>
                      <ul className={classes.cardsItems}>
                   <li className={classes.cardsItem}> 
                       <a  className={classes.cards__item__link}>
                        <figure className={classes.cards__item__picWrap} data-category="Sistema 1">
                          <img src={require("../assets/sistema1.png").default} alt="" className={classes.cards__item__img} />
                        </figure>
                        <div className={classes.cards__item__info}>
                            <h5 className={classes.cards__item__text}>Declaración patrimonial, de interes y constancia de declaración fiscal</h5>
                        </div>
                       </a>
                   </li>
                   <li className={classes.cardsItem}> 
                       <a  className={classes.cards__item__link}>
                        <figure className={classes.cards__item__picWrap} data-category="Sistema 2">
                          <img src={require("../assets/sistema2.png").default} alt="" className={classes.cards__item__img} onClick={ () => redirectToRoute("/spic")} />
                        </figure>
                        <div className={classes.cards__item__info}>
                            <h5 className={classes.cards__item__text}>Servidores públicos que intervienen en procedimientos de contratación</h5>
                        </div>
                       </a>
                   </li>
                   <li className={classes.cardsItem}> 
                       <a  className={classes.cards__item__link}>
                        <figure className={classes.cards__item__picWrap} data-category="Sistema 3">
                          <img src={require("../assets/sistema3.png").default} alt="" className={classes.cards__item__img} onClick={ () => redirectToRoute("/s3s")} />
                        </figure>
                        <div className={classes.cards__item__info}>
                            <h5 className={classes.cards__item__text}>Servidores públicos y particulares sancionados</h5>
                        </div>
                       </a>
                   </li>
                      </ul>
                      <ul className={classes.cardsItems}>
                   <li className={classes.cardsItem}> 
                       <a  className={classes.cards__item__link}>
                        <figure className={classes.cards__item__picWrap} data-category="Sistema 4">
                          <img src={require("../assets/sistema4.png").default} alt="" className={classes.cards__item__img} />
                        </figure>
                        <div className={classes.cards__item__info}>
                            <h5 className={classes.cards__item__text}>Información y comunicación del Sistema Nacional Anticorrupción y el Sistema Nacional de Fiscalización</h5>
                        </div>
                       </a>
                   </li>
                   <li className={classes.cardsItem}> 
                       <a  className={classes.cards__item__link}>
                        <figure className={classes.cards__item__picWrap} data-category="Sistema 5">
                          <img src={require("../assets/sistema5.png").default} alt="" className={classes.cards__item__img} />
                        </figure>
                        <div className={classes.cards__item__info}>
                            <h5 className={classes.cards__item__text}>Denuncias por faltas administrativas y hechos de corrupción</h5>
                        </div>
                       </a>
                   </li>
                   <li className={classes.cardsItem}> 
                       <a  className={classes.cards__item__link}>
                        <figure className={classes.cards__item__picWrap} data-category="Sistema 6">
                          <img src={require("../assets/sistema6.png").default} alt="" className={classes.cards__item__img} />
                        </figure>
                        <div className={classes.cards__item__info}>
                            <h5 className={classes.cards__item__text}>Contrataciones Públicas</h5>
                        </div>
                       </a>
                   </li>
                      </ul>
                   </div>
                 </div>
              </div>
              <FooterMain></FooterMain>
           </>
         )
}

const redirectToRoute = (path) =>{
    history.push(path);
}


export const MainMenu = mainMenu;