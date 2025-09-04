export function suggestSkills(req, res) {
    // Dummy AI endpoint: always returns 3 skills
    res.json({ skills: ['Teamwork', 'Problem Solving', 'Communication'] });
}
