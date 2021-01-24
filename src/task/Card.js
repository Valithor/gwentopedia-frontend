import React, { useState, useRef, useEffect } from 'react';
import './Card.css';  



function Card(props){
    const [shouldLoad, setShouldLoad] = useState(false);
    const placeholderRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    useEffect(() => {
      if (!shouldLoad && placeholderRef.current) {
        const observer = new IntersectionObserver(([{ intersectionRatio }]) => {
          if (intersectionRatio > 0) {
            setShouldLoad(true);
          }
        });
        observer.observe(placeholderRef.current);
        return () => observer.disconnect();
      }
    }, [shouldLoad, placeholderRef]);
  
    return(shouldLoad ?
<div onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)} className={"card-wrap card-data"} data-res="low" data-id="162309" data-artid="1314j" data-power={props.power?props.power:props.card.power} data-armor={props.card.armor} data-provision={props.card.provision} data-faction={props.card.faction==='Northern Realms'? 'northern_realms':props.card.faction.toLowerCase()} data-set={props.card.availability.toLowerCase()} data-color={props.card.color.toLowerCase()} data-type={props.card.type.toLowerCase()} data-rarity={props.card.rarity.toLowerCase()} >    
                                         <div class="card-image-wrap">
                                            <div class="card_asset-img">                                 
                                                <img key={props.card.id} src={`https://gwent.one/img/assets/low/art/${props.card.artid}.jpg`} alt={props.card.name}/>
                                        <div class="card_asset-border"></div>
                                        {props.card.armor>0?<div class="card_asset-armor-icon"><div class="card_asset-armor"></div></div>:null}
                          
                <div class="card_asset-provision-icon"></div>
                <div class="card_asset-provision-bg"><div class="card_asset-provision"></div></div>
                                  <div class="card_asset-banner"><div class="card_asset-power"></div></div>
                                  <div class="card_asset-trinket"></div>

                <div class="card_asset-rarity"></div>
                </div></div>
                {isHovered && props.size=="big-card"?<img className="hovering-card" src='/gallery/add.png'/>:null}
                {isHovered && props.size=="small-card"?<img className="hovering-card" src='/gallery/remove.png'/>:null}
                
                </div>: <div ref={placeholderRef}/>
                
);}
export default Card;