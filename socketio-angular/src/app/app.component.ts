import { SocketioService } from './socketio.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { UtilsService } from './core/services/utils/utils.service';

// static data only for demo purposes, in real world scenario, this would be already stored on client
const SENDER = {
  id: '123',
  name: 'John Doe',
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  @ViewChild('messagesDiv') messagesDiv: ElementRef;

  title = 'socketio-angular';
  heading = 'Web socket with Camunda Demo';

  CHAT_ROOM = 'myRandomChatRoomId';

  token1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMDAwMDAiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.q02s3D_xHjIQG5dwuDyxPpMTp_Hby6viFspsA_cwp4A';
  token2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMDAwMDEiLCJuYW1lIjoiSmFuZSBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.X2iVjosWc8az0gAEaqCUh1lU3ZPF2VZf1vLowy-2z-g';

  messages = [];

  tokenForm = this.formBuilder.group({
    token: '',
  });

  messageForm = this.formBuilder.group({
    message: '',
  });

  constructor(
    private socketService: SocketioService,
    private formBuilder: FormBuilder,
    private renderer:Renderer2,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    //this.token = this.utilsService.uuid() || '';
  }

  submitToken() {
    const token = this.tokenForm.get('token').value;
    if (token) {
      this.socketService.setupSocketConnection(token);
      this.socketService.subscribeToMessages((err, data) => {
        console.log('NEW MESSAGE ', data);
        this.messages = [...this.messages, data];
        this.messages = this.messages.filter((v, i, a) => a.findIndex(t => (t.id === v.id && t.message.toLowerCase() === v.message.toLowerCase())) === i);
        console.log('AppComponent: submitToken(): this.messages: ', this.messages);
      });
    }
  }

  submitMessage() {
    const message = this.messageForm.get('message').value;
    if (message) {
      //this.clearDiv();
      this.socketService.sendMessage({message, roomName: this.CHAT_ROOM}, cb => {
        console.log('ACKNOWLEDGEMENT ', cb);
      });
      /* this.messages = [
        ...this.messages,
        {
          message,
          ...SENDER,
        },
      ];
      console.log('AppComponent: submitMessage(): this.messages: ', this.messages); */
      // clear the input after the message is sent
      this.messageForm.reset();
    }
  }

  clearDiv() {
    this.renderer.setProperty(this.messagesDiv.nativeElement, 'innerHTML', '')
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }
}
