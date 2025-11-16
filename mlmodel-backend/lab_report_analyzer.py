"""
Lab Report Analysis System
Analyzes medical lab reports and provides desi home remedy suggestions
"""

import re
import json
from typing import Dict, List, Tuple, Optional
from datetime import datetime


class LabReportAnalyzer:
    """Analyzes lab reports and provides desi remedy suggestions"""
    
    def __init__(self):
        self.lab_reference_ranges = self._load_reference_ranges()
        self.remedy_knowledge_base = self._load_remedy_knowledge()
    
    def _load_reference_ranges(self) -> Dict:
        """Load normal reference ranges for common lab tests"""
        return {
            'hemoglobin': {'normal': (12.0, 16.0), 'unit': 'g/dL', 'gender_specific': True, 'male': (13.5, 17.5), 'female': (12.0, 15.5)},
            'hb': {'normal': (12.0, 16.0), 'unit': 'g/dL', 'gender_specific': True, 'male': (13.5, 17.5), 'female': (12.0, 15.5)},
            'rbc': {'normal': (4.5, 5.5), 'unit': 'million/μL'},
            'wbc': {'normal': (4000, 11000), 'unit': '/μL'},
            'platelet': {'normal': (150000, 450000), 'unit': '/μL'},
            'platelets': {'normal': (150000, 450000), 'unit': '/μL'},
            'vitamin d': {'normal': (30, 100), 'unit': 'ng/mL'},
            'vitamin d3': {'normal': (30, 100), 'unit': 'ng/mL'},
            'calcium': {'normal': (8.5, 10.5), 'unit': 'mg/dL'},
            'vitamin b12': {'normal': (200, 900), 'unit': 'pg/mL'},
            'vitamin b 12': {'normal': (200, 900), 'unit': 'pg/mL'},
            'iron': {'normal': (60, 170), 'unit': 'μg/dL'},
            'ferritin': {'normal': (15, 200), 'unit': 'ng/mL'},
            'tsh': {'normal': (0.4, 4.0), 'unit': 'mIU/L'},
            't3': {'normal': (80, 200), 'unit': 'ng/dL'},
            't4': {'normal': (5, 12), 'unit': 'μg/dL'},
            'cholesterol': {'normal': (0, 200), 'unit': 'mg/dL'},
            'hdl': {'normal': (40, 60), 'unit': 'mg/dL'},
            'ldl': {'normal': (0, 100), 'unit': 'mg/dL'},
            'triglycerides': {'normal': (0, 150), 'unit': 'mg/dL'},
            'blood sugar': {'normal': (70, 100), 'unit': 'mg/dL'},
            'glucose': {'normal': (70, 100), 'unit': 'mg/dL', 'fasting': (70, 100), 'random': (70, 140)},
            'creatinine': {'normal': (0.6, 1.2), 'unit': 'mg/dL'},
            'urea': {'normal': (7, 20), 'unit': 'mg/dL'},
            'bilirubin': {'normal': (0.1, 1.2), 'unit': 'mg/dL'},
            'sgot': {'normal': (10, 40), 'unit': 'U/L'},
            'sgpt': {'normal': (10, 40), 'unit': 'U/L'},
            'alt': {'normal': (10, 40), 'unit': 'U/L'},
            'ast': {'normal': (10, 40), 'unit': 'U/L'},
        }
    
    def _load_remedy_knowledge(self) -> Dict:
        """Load desi remedy knowledge base for lab abnormalities"""
        return {
            'hemoglobin': {
                'low': {
                    'meaning': 'Body me lahu (blood) kam ban raha hai. Isse weakness, thakaan, aur chakkar aa sakte hain.',
                    'remedies': [
                        'Roz 1 glass anaar ka juice piyein',
                        'Chukandar (beetroot) + gajar ka salad khayein',
                        'Palak, bathua, aur leafy greens khayein',
                        'Gur (jaggery) ka paani piyein',
                        'Black raisins (kishmish) pani me bhigo kar khayein',
                        'Dates (khajur) aur dry fruits khayein',
                        'Iron-rich foods: chana, dal, rajma'
                    ],
                    'doctor_note': 'Agar weakness bahut zyada ho ya chakkar aaye toh doctor se checkup karwa lena.'
                },
                'high': {
                    'meaning': 'Body me lahu zyada ban raha hai. Yeh polycythemia ka sign ho sakta hai.',
                    'remedies': [
                        'Zyada pani piyein',
                        'Regular exercise karein',
                        'Smoking avoid karein'
                    ],
                    'doctor_note': 'Please consult doctor for proper evaluation.'
                }
            },
            'vitamin d': {
                'low': {
                    'meaning': 'Body me Vitamin D ki kami hai. Isse bones kamzor ho sakte hain, pain ho sakta hai.',
                    'remedies': [
                        'Roz subah 15-20 minutes dhoop me baithiye (sunlight)',
                        'Mushrooms khayein (sun-dried)',
                        'Egg yolk khayein',
                        'Fatty fish (if non-veg)',
                        'Fortified milk piyein'
                    ],
                    'doctor_note': 'Agar pain bahut ho ya bones me problem ho toh doctor se consult karein.'
                }
            },
            'calcium': {
                'low': {
                    'meaning': 'Body me calcium kam hai. Isse bones aur teeth kamzor ho sakte hain.',
                    'remedies': [
                        'Roz 2 glass doodh piyein',
                        'Curd (dahi) khayein',
                        'Ragi (finger millet) khayein',
                        'Sesame seeds (til) khayein',
                        'Green leafy vegetables khayein',
                        'Almonds (badam) khayein'
                    ],
                    'doctor_note': 'Agar bones me pain ho ya teeth me problem ho toh doctor se checkup karwa lena.'
                }
            },
            'vitamin b12': {
                'low': {
                    'meaning': 'Vitamin B12 ki kami hai. Isse weakness, memory issues, aur tingling ho sakti hai.',
                    'remedies': [
                        'Dairy products: doodh, dahi, paneer',
                        'Eggs khayein',
                        'Fortified cereals',
                        'If non-veg: fish, chicken'
                    ],
                    'doctor_note': 'Agar tingling ya numbness ho toh doctor se consult karein.'
                }
            },
            'iron': {
                'low': {
                    'meaning': 'Body me iron kam hai. Isse anemia ho sakta hai, weakness ho sakti hai.',
                    'remedies': [
                        'Chukandar (beetroot) ka juice',
                        'Palak aur leafy greens',
                        'Dates (khajur) aur dry fruits',
                        'Jaggery (gur) ka paani',
                        'Black sesame seeds (til)',
                        'Legumes: chana, dal, rajma'
                    ],
                    'doctor_note': 'Agar weakness bahut zyada ho toh doctor se checkup karwa lena.'
                }
            },
            'cholesterol': {
                'high': {
                    'meaning': 'Cholesterol zyada hai. Isse heart problems ho sakte hain.',
                    'remedies': [
                        'Oats (jai) khayein',
                        'Garlic (lehsun) khayein',
                        'Green tea piyein',
                        'Regular exercise karein',
                        'Oily aur fried food avoid karein',
                        'Fiber-rich foods khayein'
                    ],
                    'doctor_note': 'Please consult doctor for proper cholesterol management.'
                }
            },
            'blood sugar': {
                'high': {
                    'meaning': 'Blood sugar zyada hai. Yeh diabetes ka sign ho sakta hai.',
                    'remedies': [
                        'Bitter gourd (karela) ka juice',
                        'Fenugreek (methi) seeds',
                        'Cinnamon (dalchini)',
                        'Regular exercise',
                        'Sugar aur sweets avoid karein'
                    ],
                    'doctor_note': 'Please consult doctor for proper diabetes management.'
                },
                'low': {
                    'meaning': 'Blood sugar kam hai. Isse weakness, chakkar, ya confusion ho sakti hai.',
                    'remedies': [
                        'Immediate: glucose, sugar water, or fruit juice',
                        'Regular meals khayein',
                        'Complex carbs khayein'
                    ],
                    'doctor_note': 'Agar chakkar ya confusion ho toh immediately doctor se consult karein.'
                }
            },
            'immunity': {
                'low': {
                    'meaning': 'Immunity kam hai. Isse jaldi jaldi illness ho sakti hai.',
                    'remedies': [
                        'Roz subah haldi doodh piyein',
                        'Giloy ka juice',
                        'Tulsi (basil) ki chai',
                        'Amla (Indian gooseberry) khayein',
                        'Citrus fruits: orange, lemon',
                        'Proper sleep lein (7-8 hours)',
                        'Regular exercise karein'
                    ],
                    'doctor_note': 'Agar bahut jaldi jaldi illness ho rahi ho toh doctor se consult karein.'
                }
            },
            'acidity': {
                'high': {
                    'meaning': 'Acidity zyada hai. Isse stomach me burning, discomfort ho sakti hai.',
                    'remedies': [
                        'Saunf (fennel seeds) ka paani piyein',
                        'Cold milk piyein',
                        'Jeera (cumin) water',
                        'Ajwain (carom seeds)',
                        'Spicy aur oily food avoid karein',
                        'Regular meals khayein, skip mat karein'
                    ],
                    'doctor_note': 'Agar acidity bahut zyada ho ya regular ho toh doctor se consult karein.'
                }
            }
        }
    
    def parse_lab_report(self, report_text: str) -> List[Dict]:
        """
        Parse lab report text and extract test values
        
        Args:
            report_text: Raw lab report text
        
        Returns:
            List of parsed test results
        """
        results = []
        lines = report_text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Pattern: Test Name: Value Unit (Status)
            # Examples:
            # "Hemoglobin: 8.5 g/dL (Low)"
            # "Vitamin D: 15 ng/mL (Low)"
            # "Calcium: 7.2 mg/dL (Low)"
            
            # Pattern 1: "Test Name: Value Unit (Status)"
            pattern1 = r'([^:]+):\s*([\d.]+)\s*([a-zA-Z/%]+)?\s*\(?(Low|High|Critical|Normal|Abnormal)\)?'
            match = re.search(pattern1, line, re.IGNORECASE)
            if match:
                test_name = match.group(1).strip()
                value = float(match.group(2))
                unit = match.group(3).strip() if match.group(3) and match.group(3) not in ['Low', 'High', 'Critical', 'Normal', 'Abnormal'] else ''
                status = match.group(4) if match.group(4) in ['Low', 'High', 'Critical', 'Normal', 'Abnormal'] else None
                
                results.append({
                    'test_name': test_name,
                    'value': value,
                    'unit': unit,
                    'status': status,
                    'raw_line': line
                })
                continue
            
            # Pattern 2: "Test Name: Value (Status)"
            pattern2 = r'([^:]+):\s*([\d.]+)\s*\(?(Low|High|Critical|Normal|Abnormal)\)?'
            match = re.search(pattern2, line, re.IGNORECASE)
            if match:
                test_name = match.group(1).strip()
                value = float(match.group(2))
                status = match.group(3) if match.group(3) in ['Low', 'High', 'Critical', 'Normal', 'Abnormal'] else None
                
                results.append({
                    'test_name': test_name,
                    'value': value,
                    'unit': '',
                    'status': status,
                    'raw_line': line
                })
                continue
        
        return results
    
    def analyze_value(self, test_name: str, value: float, unit: str = '', gender: str = '') -> Dict:
        """
        Analyze a single test value and determine if it's abnormal
        
        Args:
            test_name: Name of the test
            value: Test value
            unit: Unit of measurement
            gender: Patient gender (for gender-specific ranges)
        
        Returns:
            Analysis result with status and suggestions
        """
        test_name_lower = test_name.lower().strip()
        
        # Find matching reference range
        ref_range = None
        for key, ranges in self.lab_reference_ranges.items():
            if key in test_name_lower:
                ref_range = ranges
                break
        
        if not ref_range:
            return None
        
        # Get normal range
        if ref_range.get('gender_specific') and gender:
            if gender.lower() == 'male':
                normal_range = ref_range.get('male', ref_range['normal'])
            else:
                normal_range = ref_range.get('female', ref_range['normal'])
        else:
            normal_range = ref_range['normal']
        
        min_val, max_val = normal_range
        
        # Determine status
        status = 'Normal'
        severity = 'mild'
        
        if value < min_val:
            status = 'Low'
            # Calculate how low
            deviation = (min_val - value) / min_val
            if deviation > 0.3:
                severity = 'critical'
            elif deviation > 0.15:
                severity = 'moderate'
        elif value > max_val:
            status = 'High'
            # Calculate how high
            deviation = (value - max_val) / max_val
            if deviation > 0.3:
                severity = 'critical'
            elif deviation > 0.15:
                severity = 'moderate'
        
        # Get remedy suggestions
        remedy_info = None
        test_key = test_name_lower
        for key in self.remedy_knowledge_base.keys():
            if key in test_key:
                test_key = key
                break
        
        if test_key in self.remedy_knowledge_base:
            if status.lower() in self.remedy_knowledge_base[test_key]:
                remedy_info = self.remedy_knowledge_base[test_key][status.lower()]
        
        return {
            'test_name': test_name,
            'value': value,
            'unit': unit or ref_range.get('unit', ''),
            'normal_range': f"{min_val}-{max_val} {ref_range.get('unit', '')}",
            'status': status,
            'severity': severity,
            'remedy_info': remedy_info
        }
    
    def analyze_report(self, report_text: str, gender: str = '') -> Dict:
        """
        Analyze complete lab report and provide suggestions
        
        Args:
            report_text: Raw lab report text
            gender: Patient gender (optional)
        
        Returns:
            Complete analysis with all findings and suggestions
        """
        # Parse report
        parsed_results = self.parse_lab_report(report_text)
        
        if not parsed_results:
            return {
                'error': 'Could not parse lab report. Please ensure the report is in text format with test names and values.',
                'suggestions': []
            }
        
        # Analyze each result
        findings = []
        for result in parsed_results:
            analysis = self.analyze_value(
                result['test_name'],
                result['value'],
                result.get('unit', ''),
                gender
            )
            
            if analysis and analysis['status'] != 'Normal':
                findings.append(analysis)
        
        # Generate response
        response = {
            'total_tests': len(parsed_results),
            'abnormal_findings': len(findings),
            'findings': [],
            'timestamp': datetime.now().isoformat()
        }
        
        for finding in findings:
            finding_response = {
                'problem': f"{finding['test_name']} {finding['status'].lower()} hai.",
                'meaning': '',
                'remedies': [],
                'doctor_note': ''
            }
            
            if finding['remedy_info']:
                finding_response['meaning'] = finding['remedy_info']['meaning']
                finding_response['remedies'] = finding['remedy_info']['remedies']
                if finding['severity'] in ['moderate', 'critical']:
                    finding_response['doctor_note'] = finding['remedy_info'].get('doctor_note', 'Please consult doctor for confirmation.')
                else:
                    finding_response['doctor_note'] = finding['remedy_info'].get('doctor_note', '')
            else:
                finding_response['meaning'] = f"Yeh value normal se {finding['status'].lower()} hai."
                finding_response['doctor_note'] = 'Please consult doctor for proper evaluation.'
            
            response['findings'].append(finding_response)
        
        if not findings:
            response['message'] = 'Sab values normal lag rahe hain! Aap healthy hain. 👍'
        
        return response


# Global instance
_analyzer = None

def get_analyzer() -> LabReportAnalyzer:
    """Get or create global analyzer instance"""
    global _analyzer
    if _analyzer is None:
        _analyzer = LabReportAnalyzer()
    return _analyzer

