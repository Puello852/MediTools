import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { AngularFireStorage } from '@angular/fire/storage'
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

    newImage: any = {
      id: this.afs.createId(), image: ''
    }

  constructor(private Storage:AngularFireStorage,public navCtrl: NavController,private afs:AngularFirestore,public toastController: ToastController,public loadingController: LoadingController,public alertController: AlertController) { }

  
  registerUser(value,datos){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password).then( res => {
        this.updateUserSendInfo(res,datos)
        resolve(res)},
        err => reject(err))
    })
   }
  
   loginUser(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password).then(res=>{
        console.log(res)
        // this.updateUserSendInfo(res)
        resolve(res)
      },async erro=>{
        const toast = await this.toastController.create({
          message: 'Correo o contraseña no valida.',
          duration: 4000
        });
        this.loadingController.dismiss()
        toast.present();
      })
    })
   }


  
   logoutUser(){
     return new Promise((resolve, reject) => {
       if(firebase.auth().currentUser){
         firebase.auth().signOut()
         .then(async () => {
          const toast = await this.toastController.create({
            message: 'Sesión cerrada exitosamente.',
            duration: 4000
          });
          toast.present();
          this.navCtrl.navigateRoot('/home')
           resolve();
         }).catch((error) => {
           reject();
         });
       }
     })
   }

   uploadImageToFirebase(fileraw) {
    console.log(fileraw)
    const filePath = '/Image/' + this.newImage.id + '/' + 'Image' + (Math.floor(1000 + Math.random() * 9000) + 1);
    const result = this.SaveImageRef(filePath, fileraw);
    const ref = result.ref;
     result.task.then(a => {
       ref.getDownloadURL().subscribe(a => {
         console.log(a);
         this.newImage.image = a;
       });
       this.afs.collection('Image').doc(this.newImage.id).set(this.newImage);
     });

  }

     SaveImageRef(filePath, file) {

     return {
       task: this.Storage.upload(filePath, file)
       , ref: this.Storage.ref(filePath)
     };
   }

   uploadImgages(image){
     const fotos = firebase.storage().ref('pictures')
     fotos.putString(image, 'data_url')
   }

   forgotPassword(email){
     firebase.auth().sendPasswordResetEmail(email).then(async ()=>{
      const alert = await this.alertController.create({
        header: 'Instrucciones enviadas',
        mode: "md",
        message: 'Hemos enviado instrucciones para cambiar tu contraseña a <strong>'+ email + '.</strong> Revisa la bandeja de entrada y la de spam',
        buttons: ['OK']
      });
      await alert.present();
     },async erro=>{
      const alert = await this.alertController.create({
        header: '!Ups¡',
        mode: "md",
        message: 'Ocurrio un error',
        buttons: ['OK']
      });
      await alert.present();
     })
   }

   sendVerificacion(){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().currentUser.sendEmailVerification()
      .then(
        res => resolve(res),
        err => reject(err))
    })
   }
  
   userDetails(){
     return firebase.auth().currentUser;
   }

   updatePhotoProfile(url){
    firebase.auth().onAuthStateChanged((user)=>{
      user.updateProfile({
        photoURL:url
      })

    })
   }

   updateUserSendInfo(res,data){
     const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${res.user.uid}`)
     const datos = {
       id: res.user.uid,
       PrimerNombre: data.primerNombre,
       segundoNombre: data.segundoNombre,
       primerApellido: data.primerApellido,
       segundoApellido: data.segundoApellido,
       tipoDocumento: data.tipoDocumento,
       documento: data.documento,
       fechaNacimiento: data.fechaNacimiento,
       estadoCivil: data.estadoCivil,
       genero: data.genero,
       celular: data.celular,
       
     }
     return userRef.set(datos,{merge:true})
   }

   getInfoUser(userId){
    //  return this.afs.collection('users').doc(userId).snapshotChanges()
      return this.afs.doc(`users/${userId}`).valueChanges()
   }

   updateInfoUser(data){
    return this.afs.collection('users').doc(data.id).set(data)
   }

   updateMail(mail){
    return firebase.auth().currentUser.updateEmail(mail).then(async ()=>{
      const toast = await this.toastController.create({
        message: 'Correo actualizado exitosamente.',
        duration: 4000
      });
      toast.present();
     })
   }

   // ahora solo falta buscar por el ID de usuario logueado toda su informacion guia este video = https://www.youtube.com/watch?v=IBVRHUEFCtI&t=558s min=19:00 y cuando me registre una vez termine el registro debo enviarle toda la informacion y con ese motodo la podre encontrar espeficico a ese usuario

}
