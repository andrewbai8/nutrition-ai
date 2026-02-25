const usdaKey = process.env.usdaKey;
const openAIKey = process.env.openAIKey;
fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${usdaKey}&query=apple`)
  .then(response => response.json())
  .then(usdaData => {
    console.log("USDA Data:", usdaData.foods);

    return fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: `Analyze this nutrition data for an apple: ${JSON.stringify(usdaData.foods)}` }]
      })
    });
  })
  .then(res => res.json())
  .then(aiData => console.log("AI Insights:", aiData.choices.message.content))
  .catch(err => console.error("Error:", err));
// AI USDA KEY
// Macros 
const topFood = data.foods; // Get the most relevant match

// Helper function to find specific nutrients by name
const getNutrient = (name) => {
  const nutrient = topFood.foodNutrients.find(n => n.nutrientName.includes(name));
  return nutrient ? `${nutrient.value} ${nutrient.unitName}` : 'N/A';
};

const macros = {
  calories: getNutrient('Energy'),
  protein: getNutrient('Protein'),
  fat: getNutrient('Total lipid'),
  carbs: getNutrient('Carbohydrate')
};

console.log("Extracted Macros:", macros);
