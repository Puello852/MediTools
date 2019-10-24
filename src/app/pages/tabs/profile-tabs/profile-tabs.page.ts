import { Component, OnInit } from '@angular/core';
import { ActionSheetController, Platform, LoadingController, AlertController, ToastController, NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from "@ionic-native/file/ngx";
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { EditProfilePage } from '../edit-profile/edit-profile.page';
import { ApiToolsService } from 'src/app/services/api-tools.service';
@Component({
  selector: 'app-profile-tabs',
  templateUrl: './profile-tabs.page.html',
  styleUrls: ['./profile-tabs.page.scss'],
})
export class ProfileTabsPage implements OnInit {

  base64Image: string = './assets/img/person1.png';
  captureDataUrl: string;
  downloadUrl: any;

  form = new FormGroup({
    url: new FormControl(''),
  })
  datos: any = {};
  datosProfile: any = {};
  constructor(public navctrl: NavController,private api: ApiToolsService, public toastController: ToastController,public alertController: AlertController,public modalController: ModalController,public loadingController: LoadingController, private afsStorage: AngularFireStorage, public platform: Platform, public auth: AuthenticationService, public actionSheetController: ActionSheetController, private camera: Camera, private file: File) {
  }

  ngOnInit() {
    this.loadPerfil()
  }

  async edit(){
    const modal = await this.modalController.create({
      component: EditProfilePage,
      componentProps:{
        datosProfile: this.datosProfile,
        datos: this.datos
      }
    });
    return await modal.present();
  }

  async editName(e){
    const alert = await this.alertController.create({
      header: 'Escribe tu nombre',
      inputs: [
        {name: 'nombre',type: 'text',value: e,placeholder:'Nombre',label: 'Nombre',},
      ],
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
          }
        }, {
          text: 'GUARDAR',
          handler: (e) => {
            let data = {
              primerNombre: e.nombre, 
            }
            this.api.editFirstName(data).subscribe(async ()=>{
              this.loadPerfil()
              const toast = await this.toastController.create({
                message: 'Nombre actualizado exitosamente',
                duration: 2000
              });
              toast.present();
            },async erro=>{
              const toast = await this.toastController.create({
                message: erro.error.message,
                duration: 2000
              });
              toast.present();
            })
            alert.dismiss()
           
          }
        }
      ]
    })
    await alert.present();
  }

  async editName2(e){
    const alert = await this.alertController.create({
      header: 'Escribe tu segundo nombre',
      inputs: [
        {name: 'nombre',type: 'text',value: e,placeholder:'Segundo nombre',label: 'Nombre',},
      ],
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
          }
        }, {
          text: 'GUARDAR',
          handler: (e) => {
            let data = {
              segundoNombre: e.nombre,
            }
            this.api.editsecundtName(data).subscribe(async ()=>{
              this.loadPerfil()
              const toast = await this.toastController.create({
                message: 'Segundo nombre actualizado exitosamente',
                duration: 2000
              });
              toast.present();
            },async erro=>{
              const toast = await this.toastController.create({
                message: erro.error.message,
                duration: 2000
              });
              toast.present();
            })
            alert.dismiss()
           
          }
        }
      ]
    })
    await alert.present();
  }
  
  async editApellido(e){
    const alert = await this.alertController.create({
      header: 'Escribe tu apellido',
      inputs: [
        {name: 'apellido',type: 'text',value: e,placeholder:'Apellido',label: 'apellido',},
      ],
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
          }
        }, {
          text: 'GUARDAR',
          handler: (e) => {
            let data = {
              primerApellido: e.apellido,             
            }
            this.api.editPrimerApellido(data).subscribe(async ()=>{
              this.loadPerfil()
              const toast = await this.toastController.create({
                message: 'Apellido actualizado exitosamente',
                duration: 2000
              });
              toast.present();
            },async erro=>{
              const toast = await this.toastController.create({
                message: erro.error.message,
                duration: 2000
              });
              toast.present();
            })
           
          }
        }
      ]
    })
    await alert.present();
  }

   async editApellido2(e){
    const alert = await this.alertController.create({
      header: 'Escribe tu segundo apellido',
      inputs: [
        {name: 'apellido',type: 'text',value: e,placeholder:'Apellido',label: 'apellido',},
      ],
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
          }
        }, {
          text: 'GUARDAR',
          handler: (e) => {
            let data = {
              segundoApellido: e.apellido,
            }
            this.api.editSegundoApellido(data).subscribe(async ()=>{
              this.loadPerfil()
              const toast = await this.toastController.create({
                message: 'Segundo apellido actualizado exitosamente',
                duration: 2000
              });
              toast.present();
            },async erro=>{
              const toast = await this.toastController.create({
                message: erro.error.message,
                duration: 2000
              });
              toast.present();
            })
           
          }
        }
      ]
    })
    await alert.present();
  }

  async editDocumento(e){
    const alert = await this.alertController.create({
      header: 'Escribe tu documento',
      inputs: [
        {name: 'documento',type: 'number',value: e,placeholder:'Numero de documento',label: 'documento',},
      ],
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
          }
        }, {
          text: 'GUARDAR',
          handler: (e) => {
            let data = {
              documento: e.documento,
            }
            this.api.editDocumento(data).subscribe(async ()=>{
              this.loadPerfil()
              const toast = await this.toastController.create({
                message: 'Documento actualizado exitosamente',
                duration: 2000
              });
              toast.present();
            },async erro=>{
              const toast = await this.toastController.create({
                message: erro.error.message,
                duration: 2000
              });
              toast.present();
            })
           
          }
        }
      ]
    })
    await alert.present();
  }



  async editMail(e){
    const alert = await this.alertController.create({
      header: 'Escribe tu correo',
      inputs: [
        {name: 'email',type: 'email',value: e,placeholder:'example@mail.co',label: 'email',},
      ],
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
          }
        }, {
          text: 'GUARDAR',
          handler: async (e) => {


            const alert = await this.alertController.create({
              header: '¿Estas seguro?',
              message: 'Estas seguro que cambiar el correo, recuerda que una vez se hayan realizados los cambios iniciaras sesión con el nuevo correo ingresado',
              buttons: [
                {
                  text: 'CANCELAR',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: (blah) => {
                   
                  }
                }, {
                  text: 'ACEPTAR',
                  handler: async () => {
                    this.auth.updateMail(e.email).then(()=>{
                      
                      this.navctrl.navigateRoot('/home')
                    })
                   
                  }
                }
              ]
            });
            await alert.present();
          }
        }
      ]
    })
    await alert.present();
  }

  async editKey(e){
    const alert = await this.alertController.create({
      header: '¿Estas seguro?',
      message: 'Por motivos de seguridad deseas que te enviemos a tu correo electronico una serie de pasos para establer una contraseña',
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
           
          }
        }, {
          text: 'ENVIAR',
          handler: async () => {
           this.api.restablecerPass().subscribe(async ()=>{
            const alert = await this.alertController.create({
              header: 'Instrucciones enviadas',
              mode: "md",
              message: 'Hemos enviado instrucciones para cambiar tu contraseña a <strong>'+ e + '.</strong> Revisa la bandeja de entrada y la de spam',
              buttons: ['OK']
            });
            await alert.present();
           },async erro=>{
            const toast = await this.toastController.create({
              message: erro.error.message,
              duration: 2000,
              position: 'bottom',
            });
            toast.present()
           })
           
          }
        }
      ]
    });
    await alert.present();

  }

  async editNames(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Editar',
      buttons: [{
        text: 'Editar primer nombre',
        handler: () => {
          this.editName(this.datos.nombre1)
        }
      }, {
        text: 'Editar segundo nombre',
        handler: () => {
          this.editName2(this.datos.nombre2)
        }
      }, {
        text: 'Editar primer apellido',
        handler: () => {
          this.editApellido(this.datos.apellido1)
        }
      }, {
        text: 'Editar segundo apellido',
        handler: () => {
          this.editApellido2(this.datos.apellido2)
        }
      }, {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          actionSheet.dismiss()
        }
      }]
    });
    await actionSheet.present();
  
  }
  
  async loadPerfil() {
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
      mode: 'md'
    });
    await loading.present();
    this.api.GetInfoUser().subscribe(((data:any)=>{
      this.datos = data
      console.log(this.datos)
      if(data.foto== 'None'){
        this.base64Image = "./assets/img/person1.png"
      }else{
        this.base64Image = data.foto
      }
      loading.dismiss()
    }),erro=>{
      loading.dismiss()
    })
    // let dato: any = this.auth.userDetails()

    // this.datosProfile = dato
  

    // let data: any = this.auth.userDetails()
    // this.base64Image = data.photoURL
    // if (data.photoURL == null || !data.photoURL) {
    //   this.base64Image = './assets/img/person.png'
    // } else {
    //   this.base64Image = data.photoURL
    //   this.downloadUrl = data.photoURL
    // }
  }

  async onClick() {
    const alert = await this.alertController.create({
      header: '¿Estas seguro?',
      message: 'Deseas cerrar sesión',
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
           
          }
        }, {
          text: 'OK',
          handler: async () => {
            // this.auth.logoutUser()
            localStorage.clear()
            this.navctrl.navigateRoot('/home')
           
          }
        }
      ]
    });
    await alert.present();
    
  }

  onClick1() {
    let data: any = this.auth.userDetails()

    // this.auth.updatePhotoProfile(this.form.controls.url.value)
    // this.auth.userDetails()
  }


  async uploadPicture(blob: Blob) {
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
    const filePath = 'images/' + (Math.floor(1000 + Math.random() * 9000) + 1);
    const ref = this.afsStorage.ref(filePath)
    const task = ref.put(blob);

    task.then(() => {
      ref.getDownloadURL().subscribe((e) => {
        this.base64Image = e
        let data = {
          url : e
        }
     
        this.api.UploadPhoto(data).subscribe((a)=>{
          alert("Subida con exito")
        },erro=>{
          // alert(erro.error.message)
        })
        // this.auth.updatePhotoProfile(e)
        loading.dismiss()
      })
    }).catch(() => { loading.dismiss() })
  }

  async editPhoto() {

    const actionSheet = await this.actionSheetController.create({
      mode: 'md',
      header: 'Escoje una opción',
      buttons: [{
        text: 'Camara',
        role: 'destructive',
        icon: 'camera',
        handler: () => {
          this.camaraOpen()
        }
      }, {
        text: 'Galeria',
        icon: 'photos',
        handler: () => {
          this.galeriaOpen()
        }
      }]
    });
    await actionSheet.present();
  }

  async camaraOpen() {
    const options: CameraOptions = {
      correctOrientation: true,
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.CAMERA,
      mediaType: this.camera.MediaType.PICTURE,
    }

    let cameraInfo = await this.camera.getPicture(options);
    let blobInfo = await this.makeFileIntoBlob(cameraInfo);
    const uploadInfo = this.uploadToFirebase(blobInfo);


   
    // this.loadingController.dismiss()

  }

  async galeriaOpen() {
    const options: CameraOptions = {
      correctOrientation: true,
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    }

    try {


      const fileUri: string = await this.camera.getPicture(options)
      let file: string
      if (this.platform.is('ios')) {
        file = fileUri.split('/').pop()
      } else {
        file = fileUri.substring(fileUri.lastIndexOf('/') + 1, fileUri.indexOf('?'))
      }


      const path: string = fileUri.substring(0, fileUri.lastIndexOf('/'))
      const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file)
      const blob: Blob = new Blob([buffer], { type: 'image/jpeg' })
      this.uploadPicture(blob)
    } catch (e) {

    }
  }

  async makeFileIntoBlob(_imagePath) {

    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      let fileName = "";
      this.file
        .resolveLocalFilesystemUrl(_imagePath)
        .then(fileEntry => {
          let { name, nativeURL } = fileEntry;

          // get the path..
          let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));
       

          fileName = name;

          // we are provided the name, so now read the file into
          // a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          let imgBlob = new Blob([buffer], {
            type: "image/jpeg"
          });
      
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });
  }

  async uploadToFirebase(_imageBlobInfo) {

    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
    return new Promise((resolve, reject) => {
      let fileRef = firebase.storage().ref("images/" + _imageBlobInfo.fileName);
      let uploadTask = fileRef.put(_imageBlobInfo.imgBlob);
      uploadTask.then(() => {
        fileRef.getDownloadURL().then((e) => {
     
          this.base64Image = e
          let data = {
            url : e
          }
          // alert(e)
          // this.auth.updatePhotoProfile(e)
          this.api.UploadPhoto(data).subscribe((a)=>{
                alert("foto subida")
          },erro=>{
            // alert(erro.error.message)
          })
          //  this.auth.userDetails()
          //  this.loadPerfil()
          loading.dismiss()
        })
      })

      uploadTask.on(
        "state_changed",
        (_snapshot: any) => {

        },
        _error => {
    
          reject(_error);
        },
        () => {
          // completion...
          resolve(uploadTask.snapshot);
        }
      );
    });
  }


}
