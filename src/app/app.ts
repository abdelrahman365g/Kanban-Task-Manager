import { Component, Input, ViewChild } from '@angular/core';
import { Header } from './components/header/header';
import { Home } from "./components/home/home";


@Component({
  selector: 'app-root',
  imports: [ Header, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Kanban';
  @ViewChild('home') homeComponent! : Home ;

  openTaskModal(){
    this.homeComponent.openNewTask();
  }
}
