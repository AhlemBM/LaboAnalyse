import {Component, inject, OnInit} from '@angular/core';
import {ResultatsService} from '../../services/resultats/resultats.service';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-resultats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultats.component.html',
  styleUrl: './resultats.component.css'
})
export class ResultatsComponent implements OnInit{
  private resultatService = inject(ResultatsService)
  private router = inject(Router)
  resultats :any[] =[]
  errMsg :string =''
  ngOnInit() {
    const patientId = localStorage.getItem('userId')
    console.log("id user "+patientId)
    if(!patientId){
      this.errMsg = 'utilisateur non authentifié'
      return;
    }
    this.resultatService.getResultatsByIdUser(patientId).subscribe(
      {
        next:(data)=>{
          this.resultats=data
        },
        error:(err) =>{
          this.errMsg ="err lors du chargemet"
          console.error(err)
        }
      }
    )
  }

  telechargerFichier(resultatId: string) {
    this.resultatService.downloadAnalyse(resultatId);
  }

}
