import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Facebook from '@material-ui/icons/Facebook';
import YouTube from '@material-ui/icons/YouTube';
import Twitter from '@material-ui/icons/Twitter';

export const footerMain=({})=>{

    const style=makeStyles((theme)=>({
        footerContainer: {
            backgroundColor: '#dbdbdb',
            padding: '4rem 0 2rem 0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        footerLinks: {
            width: '100%',
            maxWidth: '1000px',
            display: 'flex',
            justifyContent: 'center',
            "@media screen and (max-width: 820px)":{
                paddingTop: '2rem'
            }
        },
        footerLinkWrapper: {
            display: 'flex',
            "@media screen and (max-width: 820px)":{
                flexDirection: 'column'
            }
        },
        socialMedia: {
            maxWidth: '1000px',
            width: '100%',
        },
        socialMediaWrap: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '90%',
            maxWidth: '1000px',
            margin: '40px auto 0',
            "@media screen and (max-width: 820px)":{
                flexDirection: 'column'
            }
        },
        footerLogo:{
        },
        socialLogo: {
            color: '#313e5b',
            justifySelf: 'start',
            marginLeft: '15px',
            cursor: 'pointer',
            textDecoration: 'none',
            fontSize: '2rem',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
        },
        websiteRights: {
            color: '#313e5b',
            marginBottom: '13px',
        },
        socialIcons: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '240px',
          },
          socialiconlink: {
            color: '#313e5b',
            fontSize: '24px',
          }
    }))

    const classes = style();
  
    return(<> 
                <div className={classes.footerContainer}>
                   <div className={classes.footerLinks}>
                      <div className={classes.footerLinkWrapper}></div>
                   </div>
                   <section className={classes.socialMedia}>
                 <div className={classes.socialMediaWrap}>
                   <div className={classes.footerLogo}>
                     <a className={classes.socialLogo} target="_blank" href="http://seseav.veracruz.gob.mx/">
                        <img src={require("../assets/logoFooter.png").default} alt="" />
                     </a>
                   </div>
                   <small className={classes.websiteRights}>2021 Secretaría Ejecutiva del Sistema Estatal Anticorrupción de Veracruz.</small>
                 </div>
                   </section>
                   <div className={classes.socialIcons}>
                  <a className="social-icon-link facebook" target="_blank" aria-label="Facebook" href="https://www.facebook.com/SESEAVEROficial">
                   <Facebook/>
                  </a>
                  <a className="social-icon-link youtube" target="_blank" aria-label="Youtube" href="https://www.youtube.com/channel/UCvHG9EP-jx4PmICq-ES9p2w">
                    <YouTube/>
                  </a>
                  <a className="social-icon-link twitter" target="_blank" aria-label="Twitter" href="https://twitter.com/SESEAVOficial">
                     <Twitter/>
                  </a>
                   </div>
                </div>
            </>    
           )
}

export const FooterMain=footerMain;