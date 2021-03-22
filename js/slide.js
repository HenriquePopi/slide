import debounce from "./debounce.js"
export  class Slide{
  constructor(wrapper, slide){
    this.wrapper = document.querySelector(wrapper)
    this.slide = document.querySelector(slide)
    this.distancia= {finalPositiom: 0, startX: 0,actualPosition:0,moved:0}
    this.changeEvent = new Event('changeEvent')
  }

  transition(boolean){
    this.slide.style.transition = boolean ? 'transform .3s' : ''
  }
  moveSlide(distanceX){
    this.distancia.actualPosition = distanceX
    this.slide.style.transform = `translate3d(${distanceX}px, 0px, 0px)`
  }
  updatePosition(clientX){
    this.distancia.moved = (clientX - this.distancia.startX )* 1.7 
    return this.distancia.moved + this.distancia.finalPositiom
  }
  onStart(event){
    let moveType 
    this.transition(false)
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
    this.distancia.finalPositiom = this.distancia.actualPosition
    this.transition(true)
    this.changeSlideOnEnd()
  }

  
  changeSlideOnEnd(){
   if(this.distancia.moved < -120) this.activeNextSlide()
   else if(this.distancia.moved > 120) this.activePrevSlide()
   else this.changeSlide(this.slideArrayIndex.active)
    
  }



  // configuração de slide
  slidePosition(slideItem){
    const margin = (this.wrapper.offsetWidth - slideItem.offsetWidth)/2
    return -(slideItem.offsetLeft - margin)
  }
  slideConfig(){
    this.slideArray = [...this.slide.children].map(element =>{
      const position = this.slidePosition(element)
      return{ element, position}
    })
  }
  changeSlide(slideArrayIndex){
    const activeSlide = this.slideArray[slideArrayIndex].position
    this.moveSlide(activeSlide)
    this.slideIndexNav(slideArrayIndex)
    this.distancia.finalPositiom = activeSlide
    this.addActiveClass(slideArrayIndex)
    this.wrapper.dispatchEvent(this.changeEvent)
  }
  slideIndexNav(slideArrayIndex){
    this.slideArrayIndex = {
      prev: (slideArrayIndex - 1 >= 0) ? slideArrayIndex - 1 : slideArrayIndex,
      active:  slideArrayIndex,
      next:(slideArrayIndex + 1 < this.slideArray.length) ? slideArrayIndex + 1 : slideArrayIndex ,
    }
  }
  activePrevSlide(){
    this.changeSlide(this.slideArrayIndex.prev)
    
  }
  activeNextSlide(){
    this.changeSlide(this.slideArrayIndex.next)
  }
  addActiveClass(slideArrayIndex){
    this.slideArray.forEach(item => item.element.classList.remove("active"))
    this.slideArray[slideArrayIndex].element.classList.add("active")
  }
  onResize(){
    this.slideConfig()
    this.changeSlide(this.slideArrayIndex.active)
  }
  addEvent(){
    this.wrapper.addEventListener('mousedown', this.onStart)
    this.wrapper.addEventListener('touchstart', this.onStart)
    this.wrapper.addEventListener('mouseup', this.onEnd)
    this.wrapper.addEventListener('touchend', this.onEnd)
    window.addEventListener('resize',this.onResize)
  }
  bindEvents(){
    this.onStart = this.onStart.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onEnd = this.onEnd.bind(this)
    this.onResize = debounce(this.onResize.bind(this),600)
    this.activeNextSlide = this.activeNextSlide.bind(this)
    this.activePrevSlide = this.activePrevSlide.bind(this)
    
  }
  init(){
    this.bindEvents()
    this.addEvent()
    this.slideConfig()
    this.changeSlide(3)
    this.onResize()
    return this
  }
}





export class SlideNav extends Slide{
  constructor(wrapper, slide){
    super(wrapper, slide)
    this.bindControlMethods()
  }
  bindControlMethods(){
    this.activeControlItem = this.activeControlItem.bind(this)
  }
  addArrow(prev,next){
    this.prevElement = document.querySelector(prev)
    this.nextElement = document.querySelector(next)
    this.addArrowEvent()
  }
  addArrowEvent(){
    this.prevElement.addEventListener('click',this.activePrevSlide)
    this.nextElement.addEventListener('click',this.activeNextSlide)
  }
  createControl(){
    const control =  document.createElement('ul')
    control.dataset.control = 'navegacao'
    this.slideArray.forEach((element, index) => {
      control.innerHTML += `<li> <a href="#slide${index +1}">${index+1}</li>` 
    });
   this.wrapper.appendChild(control)
   return control
  }
  eventControl(item, index){
    item.addEventListener("click",(event)=> {
      event.preventDefault()
      this.changeSlide(index)
    })
    this.wrapper.addEventListener("changeEvent", this.activeControlItem)
    
  }
  activeControlItem(){
    this.controlArray.forEach(element =>element.classList.remove("active"));
    this.controlArray[this.slideArrayIndex.active].classList.add("active")
  }
  addControl(customControl){
    const control = document.querySelector(customControl) || this.createControl()
    this.controlArray = [...control.children]
    this.controlArray.forEach((element, index) => this.eventControl(element,index))
  }
}