import DaycareList from "@/components/organisms/DaycareList";


export default function HomePage() {
  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>Bienvenue sur votre plateforme de gestion de garderies canines !</h1>
      <p>Choisissez votre garderie :</p>
      <DaycareList />
    </div>
  )
}