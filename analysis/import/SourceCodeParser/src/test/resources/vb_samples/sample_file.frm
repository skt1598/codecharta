VERSION 5.00
Begin VB.Form Form1
   Caption         =   "Form1"
   ClientHeight    =   4530
   ClientLeft      =   60
   ClientTop       =   420
   ClientWidth     =   5850
   LinkTopic       =   "Form1"
   ScaleHeight     =   4530
   ScaleWidth      =   5850
   StartUpPosition =   3  'Windows Default
   Begin VB.HScrollBar H3
      Height          =   495
      Left            =   1440
      Max             =   255
      TabIndex        =   2
      Top             =   3000
      Width           =   2895
   End
   Begin VB.HScrollBar H2
      Height          =   495
      Left            =   1440
      Max             =   255
      TabIndex        =   1
      Top             =   2280
      Width           =   2895
   End
   Begin VB.HScrollBar H1
      Height          =   495
      Left            =   1440
      Max             =   255
      TabIndex        =   0
      Top             =   1560
      Width           =   2895
   End
   Begin VB.Label Label4
      Height          =   495
      Left            =   840
      TabIndex        =   6
      Top             =   120
      Width           =   3615
   End
   Begin VB.Label Label3
      Alignment       =   2  'Center
      BackStyle       =   0  'Transparent
      Caption         =   "BLUE"
      BeginProperty Font
         Name            =   "Comic Sans MS"
         Size            =   9.75
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00FF0000&
      Height          =   495
      Left            =   120
      TabIndex        =   5
      Top             =   3000
      Width           =   1215
   End
   Begin VB.Label Label2
      Alignment       =   2  'Center
      BackStyle       =   0  'Transparent
      Caption         =   "GREEN"
      BeginProperty Font
         Name            =   "Comic Sans MS"
         Size            =   9.75
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H0000C000&
      Height          =   495
      Left            =   120
      TabIndex        =   4
      Top             =   2280
      Width           =   1215
   End
   Begin VB.Label Label1
      Alignment       =   2  'Center
      BackStyle       =   0  'Transparent
      Caption         =   "RED"
      BeginProperty Font
         Name            =   "Comic Sans MS"
         Size            =   9.75
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H000000FF&
      Height          =   495
      Left            =   120
      TabIndex        =   3
      Top             =   1560
      Width           =   1215
   End
End
Attribute VB_Name = "Form1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub Form_Load()
Me.Caption = "Color Bar"
End Sub

Private Sub H1_Change()
Me.BackColor = RGB(H1.Value, H2.Value, H3.Value)
Label4.Caption = "Red = " & H1.Value & " ," & "Green = " & H2.Value & "," & "Blue = " & H3.Value
End Sub

Private Sub H2_Change()
Me.BackColor = RGB(H1.Value, H2.Value, H3.Value)
Label4.Caption = "Red = " & H1.Value & " ," & "Green = " & H2.Value & "," & "Blue = " & H3.Value

End Sub

Private Sub H3_Change()
Me.BackColor = RGB(H1.Value, H2.Value, H3.Value)
Label4.Caption = "Red = " & H1.Value & " ," & "Green = " & H2.Value & "," & "Blue = " & H3.Value

End Sub