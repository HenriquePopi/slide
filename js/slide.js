export default class Slide{
  constructor(wrapper, slide){
    this.wrapper = document.querySelector(wrapper)
    this.slide = document.querySelector(slide)
    this.distancia= {
      finalPositiom: 0,
      startX: 0,
      movement:0
    }
  }
  moveSlide(distanceX){
    this.distancia.movement = distanceX
    this.slide.style.transform = `translate3d(${distanceX}px, 0px, 0px)`
  }
  updatePosition(clientX){
    this.distancia.movement = (clientX - this.distancia.startX )* 1.7 
    return this.distancia.movement + this.distancia.finalPositiom
  }
  onStart(event){
    let moveType 
    if(event.type == "mousedown"){
      event.preventDefault()
      this.distancia.startX = event.clientX // adiciona ao objeto a posição no eixo X no momento do click
      moveType = 'mousemove'
    }else{
      this.distancia.startX = event.changedTouches[0].clientX
      moveType = 'touchmove'
    }
    this.wrapper.addEventListener(moveType, this.onMove)
  }

  onMove(event){
    const pointerType = (event.type === "mousemove") ? event.clientX : event.changedTouches[0].clientX
    const finalPositiom = this.updatePosition(pointerType)
    this.moveSlide(finalPositiom)
  }

  onEnd(event){
    const  moveType = (event.type == "mouseup") ? 'mousemove' : 'touchmove'
    this.wrapper.removeEventListener(moveType, this.onMove)
    this.distancia.finalPositiom = this.distancia.movement
    

  }
  addEvent(){
    this.wrapper.addEventListener('mousedown', this.onStart)
    this.wrapper.addEventListener('touchstart', this.onStart)
    this.wrapper.addEventListener('mouseup', this.onEnd)
    this.wrapper.addEventListener('touchend', this.onEnd)
  }
  bindEvents(){
    this.onStart = this.onStart.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onEnd = this.onEnd.bind(this)
  }
  init(){
    this.bindEvents()
    this.addEvent()
    return this
  }
}