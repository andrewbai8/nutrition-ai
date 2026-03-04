const usdaKey = ;
const geminiKey = ; // replace open ai with gemini
// -> replaced open ai with gemini 
document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('foodInput').value;

  fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${usdaKey}&query=${query}`)
    .then(res => res.json())
    .then(usdaData => {
      const topFood = usdaData.foods[0]; // 
      if (!topFood) throw new Error("No foods found");
// creating the variable to get the nutrients facts
      const getNutrient = (name) => {
        const n = topFood.foodNutrients.find(nut => nut.nutrientName.includes(name));
        return n ? `${n.value}${n.unitName}` : 'N/A';
      };
// this is getting the macros
      const macros = {
        calories: getNutrient('Energy'),
        protein: getNutrient('Protein'),
        fat: getNutrient('Total lipid'),
        carbs: getNutrient('Carbohydrate')
      };
// getting the results from the macros
      const resultsDiv = document.getElementById('macroResults');
      resultsDiv.innerHTML = `<h3>${topFood.description}</h3>
       <p>Calories: ${macros.calories}</p>
       <p>Protein: ${macros.protein}</p>`;
      document.getElementById('macroModal').style.display = 'block';

      return fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Analyze these macros: ${JSON.stringify(macros)}` }] }]
        })
      });
    })
    .then(res => res.json())
    .then(aiData => {
      const insight = aiData.candidates[0].content.parts[0].text; 
      document.getElementById('macroResults').innerHTML += `<p><strong>AI Insight:</strong> ${insight}</p>`;
    })
    .catch(err => console.error("Error:", err));
}); 